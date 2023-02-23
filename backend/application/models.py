from datetime import datetime, timedelta, date
import requests
from dotenv import load_dotenv
import logging
import threading
import json
load_dotenv()

class User():
    def __init__(self, info_json):
        self.id = info_json['id']
        self.email = info_json['email']
        self.login = info_json['login']
        self.first_name = info_json['first_name']
        self.last_name = info_json['last_name']
        self.usual_full_name = info_json['usual_full_name']
        self.first_name = info_json['usual_first_name']
        self.url = info_json['url']
        self.phone = info_json['phone']
        self.displayname = info_json['displayname']
        self.kind = info_json['kind']
        self.image = info_json['image']
        self.staff = info_json['staff?']
        self.correction_point = info_json['correction_point']
        self.pool_month = info_json['pool_month']
        self.pool_year = info_json['pool_year']
        self.location = info_json['location']
        self.wallet = info_json['wallet']
        self.anonymize_date = info_json['anonymize_date']
        self.data_erasure_date = info_json['data_erasure_date']
        self.created_at = info_json['created_at']
        self.updated_at = info_json['updated_at']
        self.alumnized_at = info_json['alumnized_at']
        self.alumni = info_json['alumni?']
        self.active = info_json['active?']
        self.groups = info_json['groups']
        self.cursus_users = info_json['cursus_users']
        self.is_cadet = False
        for user in self.cursus_users:
            if user['cursus_id'] == 21:
                self.is_cadet = True
        self.projects_users = info_json['projects_users']
        self.language_users = info_json['languages_users']
        self.achievements = info_json['achievements']
        self.titles = info_json['titles']
        self.titles_users = info_json['titles_users']
        self.partnerships = info_json['partnerships']
        self.patroned = info_json['patroned']
        self.patroning = info_json['patroning']
        self.expertises_users = info_json['expertises_users']
        self.roles = info_json['roles']
        self.campus = info_json['campus']
        self.campus_users = info_json['campus_users']

class Token():

    def get_active_user_info(self):
        """Querry percise information about every single saved user on campus

        Returns:
            _type_: _description_
        """
        #get info about every active user on campus
        logging.debug("Querrying for active users")
        temp = []
        for page in range (0, 10000):
            url = f'https://api.intra.42.fr/v2/campus/{self.campus_id}/locations?filter[active]=true&per_page=100&page={page}&access_token={self.get_token()}'
            response = requests.get(url)
            temp += [user['user'] for user in response.json()]
            if (len(response.json()) != 100):
                break

        info = []
        json_data = []
        for user in temp:
            url = f"https://api.intra.42.fr/v2/users/{user['id']}?access_token={self.get_token()}"
            response = requests.get(url)
            try:
                user = User(response.json())
                json_data.append(response.json())
                info.append(user)
            except Exception as err:
                logging.error(err)

        #save info as json, to pass between proccesses
        with open("active_user_info.json", "w") as _f:
            _f.write(json.dumps(json_data))
        return (info)

    def get_token(self):
        """Get the 42 API token, renew if expired
        """
        if datetime.now() > self._token_expiration - timedelta(seconds=60):
            logging.debug("API token expired")
            headers = {'Content-type' : 'application/json'}
            r = requests.post(f"https://api.intra.42.fr/oauth/token?grant_type=client_credentials&client_id={self.uid}&client_secret={self.secret}", headers=headers)
            self._token = r.json()['access_token']
            self._token_expiration = datetime.now() + timedelta(seconds=r.json()['expires_in'])
        return (self._token)

    def __init__(self, campus_id, uid, secret):
        self.uid = uid
        self.secret = secret
        self.campus_id = campus_id

        
        self._token = None
        self._token_expiration = datetime.now()
        
        self.weekly_cadet_xp = self.load_weekly_cadet_xp()
        self.weekly_cadet_xp_timeout = datetime.now() + timedelta(hours=6)
        
        self.week_active_users = {}
        self.active_users = None
        self.active_user_info = self.get_active_user_info()
        self.user_info_timeout = datetime.now() + timedelta(minutes=30)
    
        self.daily_active_users = self.load_daily_active_users()
        self.daily_users_timeout = datetime.now() + timedelta(minutes=30)

    def get_active_users(self):
        
        #return info in a pretty format
        if datetime.now() > self.user_info_timeout:
            logging.debug("User info timed out, requerry")
            active_users_querry = threading.Thread(target=self.get_active_user_info)
            active_users_querry.start()
            self.user_info_timeout = datetime.now() + timedelta(minutes=30)

        with open("active_user_info.json", "r") as _f:
            temp = json.loads(_f.read())

        self.active_user_info = []
        for user in temp:
            self.active_user_info.append(User(user))

        ret = []
        for user in self.active_user_info:
            temp = {}
            temp['login'] = user.login
            temp['image'] = user.image['link']
            temp['id'] = user.id
            if not temp['image']:
                temp['image'] = "https://i.imgur.com/F0zhHes.jpg"
            temp['is_cadet'] = False
            if (user.is_cadet):
                temp['is_cadet'] = True
            ret.append(temp)
        return ret

    def active_user_projects(self) -> dict:
        """
        Get data about projects being worked on at campus

        Returns:
            dict: {"projects" : [ {"project-name" : str, "user-num" : int} ] }
        """

        projects = {}
        for user in self.active_user_info:
            projecters = user.projects_users
            project = ""
            for prod in projecters:

                #skip unfinished projects
                if (user.is_cadet and 21 not in prod['cursus_ids']):
                    continue
                if not prod["validated?"]:
                    project = prod["project"]["name"]
                    break
            if project not in projects.keys() and project:
                projects[project] = 0
            if project:
                projects[project] += 1
        return (projects)

    def average_user_level(self) -> dict:
        """
        Get average user level on campus

        Returns:
            dict: {'average_level': int}
        """

        level = 0
        count = 0
        for user in self.active_user_info:
            try:
                level += user.cursus_users[-1]['level']
                count += 1
            except Exception as err:
                logging.error(err)
        return ({'average_level':round(level / count, 1)})

    def average_session_hours(self) -> dict:
        """
        Get the average number of hours spent on campus iMacs

        Returns:
            dict: {"average_session_hours": int}
        """

        count = 0
        total = 0
        url = f'https://api.intra.42.fr/v2/campus/{self.campus_id}/locations?filter[active]=true&access_token={self.get_token()}'
        response = requests.get(url)
        if (response.ok):
            for user in response.json():
                if (user['end_at'] == None):
                    current_time = datetime.utcnow()
                    user['begin_at'] = user['begin_at'].replace('T', '-')
                    user['begin_at'] = user['begin_at'][:user['begin_at'].find('.')]
                    begin_at = datetime.strptime(user['begin_at'], "%Y-%m-%d-%H:%M:%S")
                    total += (current_time - begin_at).total_seconds()
                    count += 1
            return ({"average_session_hours":round(total/count/60/60, 1)})
        else:
            return ({"average_session_hours":0.42})

    def most_recent_submission(self) -> dict:
        """
        Gets the most recent project submission on for a campus

        Returns:
            dict: {"users":users, "skills":skills, "project":project, "score":score}
        """

        _now = datetime.now() + timedelta(days=7) #just make it into the future to get everything
        _week_ago = datetime.now() - timedelta(days=1)
        logging.debug(f"Querry for most recent submission, with time between {_now}, {_week_ago}")
        url = f"https://api.intra.42.fr/v2/projects_users?range[final_mark]=50,200&filter[campus]={self.campus_id}&filter[marked]=true&range[marked_at]={_week_ago.year}-{_week_ago.month}-{_week_ago.day}T00%3A00%3A00.000Z,{_now.year}-{_now.month}-{_now.day}T00%3A00%3A00.000Z&per_page=100&page=0&access_token={self.get_token()}"
        response = requests.get(url)

        def convert_time(date_string):
            return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ")

        newlist = sorted(response.json(), key=lambda d: convert_time(d['updated_at'])) 

        if (not response.ok):
            logging.error("Intra returned not ok for most_recent")
            return {}

        users = []
        for user in newlist[-1]['teams'][-1]['users']:
            _temp = {}
            _temp['login'] = user['login']
            _temp['image'] = requests.get(
                                f"https://api.intra.42.fr/v2/users?filter[login]={user['login']}&access_token={self.get_token()}"
                            ).json()[0]['image']['link']
            if not _temp['image']:
                _temp['image'] = "https://i.imgur.com/F0zhHes.jpg"
            users.append(_temp)
        
        project = newlist[-1]['project']['name']
        score = newlist[-1]['final_mark']
        # skills = []
        # skill_ids = requests.get(f"https://api.intra.42.fr/v2/project_sessions/{most_recent_user['teams'][-1]['project_session_id']}/project_sessions_skills?access_token={self.get_token()}").json()
        # for skill_id in skill_ids:
        #     skill_str = requests.get(f"https://api.intra.42.fr/v2/skills/{skill_id['skill_id']}?access_token={self.get_token()}").json()['slug']
        #     skills.append(skill_str)

        
        # return ({"users":users, "skills":skills, "project":project, "score":score})
        seconds_since_submission = (datetime.now() - datetime.strptime(newlist[-1]['updated_at'], "%Y-%m-%dT%H:%M:%S.%fZ")).total_seconds()
        if seconds_since_submission <= 3600:
            time_string = f"{int(seconds_since_submission / 60)} minutes ago"
        else:
            time_string = f"{int(seconds_since_submission / 60 / 60)} hours ago"
        return ({"users":users, "project":project, "score":score, "time":time_string})
    

    def cadet_pisciner_ratio(self) -> dict:
        """
        Get the ratio of pisciners to cadets on campus

        Returns:
            dict: { "cadets" : 15, "pisciners":33 }
        """
        cadets = 0
        pisciners = 0
        for user in self.active_user_info:
            if user.is_cadet:
                cadets += 1
            else:
                pisciners += 1
        return ({"cadets":cadets, "pisciners":pisciners})

    def active_users_skills(self):
        """
        Get skills of cadets on campus

        Returns:
            dict: {'Skill name': int}
        """

        skills = {}
        _count = {}
        for user in self.active_user_info:

            if user.is_cadet:
                for skill in user.cursus_users[-1]['skills']:
                    if (skill['name'] not in skills.keys()):
                        skills[skill['name']] = 0
                        _count[skill['name']] = 0
                    _count[skill['name']] += 1
                    skills[skill['name']] += float(skill['level'])
        
        for skill in skills.keys():
            skills[skill] = round((skills[skill] * 2.5) / _count[skill], 2)

        return (skills)

    def load_daily_active_users(self):
        logging.debug("Loading daily user data from last 7 days")
        response = None
        week_sessions = []
        _now = datetime.now() + timedelta(days=1)
        _week_ago = _now - timedelta(days=7)
        logging.debug(f"Querry for daily active users between {_now} and {_week_ago}")
        for page in range(0, 1000):
                url = f'https://api.intra.42.fr/v2/campus/{self.campus_id}/locations?sort=begin_at&per_page=100&page={page}&range[begin_at]={_week_ago.year}-{_week_ago.month}-{_week_ago.day}T00%3A00%3A00.000Z,{_now.year}-{_now.month}-{_now.day}T23%3A59%3A00.000Z&access_token={self.get_token()}'
                response = requests.get(url)
                
                for session in response.json():
                    week_sessions.append(session)
                if (len(response.json()) < 100):
                    break
                
        with open("week_sessions.json", "w") as _f:
            _f.write(json.dumps(week_sessions))

        dates = {}

        for session in week_sessions:
            start_time = datetime.strptime(session['begin_at'], "%Y-%m-%dT%H:%M:%S.%fZ").date()
            if f"{start_time.year} {start_time.month} {start_time.day}" not in dates.keys():
                dates[f"{start_time.year} {start_time.month} {start_time.day}"] = []
            if (session['user']['login'] not in dates[f"{start_time.year} {start_time.month} {start_time.day}"]):
                dates[f"{start_time.year} {start_time.month} {start_time.day}"].append(session['user']['login'])

        temp = {}
        for day in dates.keys():
            date_obj = datetime.strptime(day, '%Y %m %d')
            date_obj = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
            temp[date_obj.isoformat()] = len(dates[day])
        with open("daily_active_users.json", "w") as _f:
            _f.write(json.dumps(temp))
        return temp

    def get_daily_active_users(self):
        with open("daily_active_users.json", "r") as _f:
            self.week_active_users = json.loads(_f.read())
        if (datetime.now() > self.daily_users_timeout):
            self.daily_users_timeout = datetime.now() + timedelta(minutes=30)
            thread = threading.Thread(target=self.load_daily_active_users)
            thread.start()
        return (self.daily_active_users)
    
    def load_weekly_cadet_xp(self):
        logging.debug("Loading daily weekly cadet xp")
        response = None
        dates = {}

        _now = datetime.now()
        days_since_monday = date.today().weekday()
        _temp_save = []
        for x in range(7):
                
                day_xp = []
                for page in range(0, 10000):
                    print(f"NOW {_now}")
                    _week_start = _now - timedelta(days=days_since_monday)
                    url = f'https://api.intra.42.fr/v2/campus/{self.campus_id}/experiences?per_page=100&filter[cursus_id]=21&page={page}&range[created_at]={_week_start.year}-{_week_start.month}-{_week_start.day}T23%3A59%3A00.000Z,{_now.year}-{_now.month}-{_now.day}T23%3A59%3A00.000Z&access_token={self.get_token()}'
                    response = requests.get(url)
                    day_xp += response.json()
                    _temp_save += response.json()
                    if (len(response.json()) < 100):
                        break
                dates[_now.isoformat()] = sum(int(user['experience']) for user in day_xp)
                _now = _now - timedelta(days=days_since_monday)
                days_since_monday = 7

        with open("total_xp.json", "w") as _f:
            _f.write(json.dumps(_temp_save))
    
        with open("weekly_cadet_xp.json", "w") as _f:
            _f.write(json.dumps(dates))
        return dates

    def get_weekly_cadet_xp(self):
        with open("weekly_cadet_xp.json", "r") as _f:
            self.weekly_cadet_xp = json.loads(_f.read())
        if (datetime.now() > self.weekly_cadet_xp_timeout):
            self.weekly_cadet_xp_timeout = datetime.now() + timedelta(hours=6)
            thread = threading.Thread(target=self.load_weekly_cadet_xp)
            thread.start()
        return (self.weekly_cadet_xp)
        
    def weekly_most_active_users(self):
        logging.debug("Loading weekly top 5 logged hour users")

        try:
            with open("week_sessions.json", "r") as _f:
                sessions = json.loads(_f.read())
        except:
            return {}

        users = {}
        for session in sessions:
            login = session['user']['login']
            begin_at = datetime.strptime(session['begin_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
            if (not session['end_at']):
                end_at = datetime.now()
            else:
                end_at = datetime.strptime(session['end_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
            
            difference = (end_at - begin_at).total_seconds() / 3600 #difference in hours
            if (login not in users.keys()):
                users[login] = {'login':login, 'hours':0, 'image':session['user']['image']['link']}
            users[login]['hours'] += int(difference) 

        users = dict(sorted(users.items(), key=lambda item: item[1]['hours'], reverse=True))
        top_five = []
        for key, value in users.items():
            if len(top_five) == 5:
                break
            top_five.append(value)

        return top_five
    
    def weekly_most_gained_xp(self):
        logging.debug("Loading weekly top 5 gained xp users")

        try:
            with open("total_xp.json", "r") as _f:
                total_xp = json.loads(_f.read())
        except:
            return {}

        def get_image(token, user_id):
            url = f"https://api.intra.42.fr/v2/users/{user_id}?access_token={token}"
            response = requests.get(url)
            user = User(response.json())
            return user.image['link']


        users = {}
        for session in total_xp:
            login = session['user']['login']
            xp = int(session['experience'])
            
            if (login not in users.keys()):
                users[login] = {'login':login, 'xp':0, 'id': session['user']['id']}
            users[login]['xp'] += int(xp) 

        users = dict(sorted(users.items(), key=lambda item: item[1]['xp'], reverse=True))
        top_five = []
        for key, value in users.items():
            if len(top_five) == 5:
                break
            value['image'] = get_image(self.get_token(), value['id'])
            top_five.append(value)

        return top_five