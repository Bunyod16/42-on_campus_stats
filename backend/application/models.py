from datetime import datetime, timedelta
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
        self.week_active_users = {}
        self.active_users = None
        self.active_user_info = self.get_active_user_info()
        self.user_info_timeout = datetime.now() + timedelta(minutes=30)
        self.weekly_active_users = self.load_weekly_active_users()
        self.weekly_active_user_timeout = datetime.now() + timedelta(minutes=30)
        
        #start requerry users thread
        

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
                temp['image'] = "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs2/143743992/original/8e2aa89710331eb6413a3383f63e49a987b4d575/make-you-into-a-lego-star-wars-character-profile-pic.png"
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

        most_recent_user = None

        _now = datetime.now() + timedelta(days=7) #just make it into the future to get everything
        _week_ago = datetime.now() - timedelta(days=7)
        url = f"https://api.intra.42.fr/v2/projects_users?filter[campus]={self.campus_id}&filter[marked]=true&range[marked_at]={_week_ago.year}-{_week_ago.month}-{_week_ago.day}T00%3A00%3A00.000Z,{_now.year}-{_now.month}-{_now.day}T00%3A00%3A00.000Z&per_page=100&page=0&access_token={self.get_token()}"
        response = requests.get(url)
        if (not response.ok):
            logging.error("Intra returned not ok for most_recent")
            return {}

        for submission in response.json():
            submission_time = datetime.strptime(submission['marked_at'], "%Y-%m-%dT%H:%M:%S.%fZ")

            if (not most_recent_user or submission_time > most_recent_user['datetime']):
                    most_recent_user = submission
                    most_recent_user['datetime'] = submission_time

        users = []
        for user in most_recent_user['teams'][-1]['users']:
            _temp = {}
            _temp['login'] = user['login']
            _temp['image'] = requests.get(
                                f"https://api.intra.42.fr/v2/users?filter[login]={user['login']}&access_token={self.get_token()}"
                            ).json()[0]['image']['link']
            if not _temp['image']:
                _temp['image'] = "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs2/143743992/original/8e2aa89710331eb6413a3383f63e49a987b4d575/make-you-into-a-lego-star-wars-character-profile-pic.png"
            users.append(_temp)
        
        project = most_recent_user['project']['name']
        score = most_recent_user['final_mark']

        # skills = []
        # skill_ids = requests.get(f"https://api.intra.42.fr/v2/project_sessions/{most_recent_user['teams'][-1]['project_session_id']}/project_sessions_skills?access_token={self.get_token()}").json()
        # for skill_id in skill_ids:
        #     skill_str = requests.get(f"https://api.intra.42.fr/v2/skills/{skill_id['skill_id']}?access_token={self.get_token()}").json()['slug']
        #     skills.append(skill_str)

        
        # return ({"users":users, "skills":skills, "project":project, "score":score})
        return ({"users":users, "project":project, "score":score})
    

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

    def load_weekly_active_users(self):
        logging.debug("Loading daily user data from last 7 days")
        response = None
        week_sessions = []
        _now = datetime.now() + timedelta(days=1)
        _week_ago = _now - timedelta(days=6)
        for page in range(0, 1000):
                url = f'https://api.intra.42.fr/v2/campus/{self.campus_id}/locations?per_page=100&page={page}&range[begin_at]={_week_ago.year}-{_week_ago.month}-{_week_ago.day}T00%3A00%3A00.000Z,{_now.year}-{_now.month}-{_now.day}T00%3A00%3A00.000Z&access_token={self.get_token()}'
                response = requests.get(url)
                
                for session in response.json():
                    week_sessions.append(session)
                    # session_start = datetime.strptime(session['begin_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
                    # if (session_start < _week_ago):
                    #     break
                # if (session_start < _week_ago):
                #         break
                if (len(response.json()) < 100):
                    break
                

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
        with open("weekly_active_users.json", "w") as _f:
            _f.write(json.dumps(temp))
        return temp

    def get_weekly_active_users(self):
        with open("weekly_active_users.json", "r") as _f:
            self.week_active_users = json.loads(_f.read())
        if (datetime.now() + timedelta(minutes=30) > weekly_active_user_timeout):
            thread = threading.Thread(target=self.load_weekly_active_users)
            thread.start()
            self.weekly_active_user_timeout = datetime.now() + timedelta(minutes=30)
        return (self.weekly_active_users)
        
