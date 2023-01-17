from datetime import datetime, timedelta
import requests
from dotenv import load_dotenv
import logging

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
        info = []
        for user in self.saved_active_users():
            url = f"https://api.intra.42.fr/v2/users/{user['id']}?access_token={self.token}"
            response = requests.get(url)
            user = User(response.json())
            info.append(user)
        return (info)

    def _renew_token(self):
        logging.debug("requesting for credentials")
        UID = self.uid
        SECRET = self.secret
        headers = {'Content-type':'application/json'}
        r = requests.post(f"https://api.intra.42.fr/oauth/token?grant_type=client_credentials&client_id={UID}&client_secret={SECRET}", headers=headers)
        self.token = r.json()['access_token']
        self.expiry = datetime.now() + timedelta(seconds=r.json()['expires_in'])

    def __init__(self, campus_id, uid, secret):
        self.uid = uid
        self.secret = secret
        self._renew_token()
        self.campus_id = campus_id
        self.active_users = None
        self.active_user_info = self.get_active_user_info()

    def is_expired(self):
        if (datetime.now() - self.expiry).seconds < 30:
            self._renew_token()

    def get_active_users(self):
        url = f'https://api.intra.42.fr/v2/campus/{self.campus_id}/locations?access_token={self.token}'
        response = requests.get(url)
        oncampus_users = []
        for user in response.json():
            info = {}
            if (user['end_at'] == None):
                info['login'] = user['user']['login']
                info['image'] = user['user']['image']['link']
                info['id'] = user['user']['id']
                oncampus_users.append(info)
        self.active_users = oncampus_users
        return ({"users":oncampus_users})

    def saved_active_users(self):
        if (self.active_users != None):
            return (self.active_users)
        self.get_active_users()
        print(f"Fetching data of {len(self.active_users)} active campus users, this may take a while...")
        return self.active_users

    def active_user_projects(self) -> dict:
        """
        Get data about projects being worked on at campus

        Returns:
            dict: {"projects" : [ {"project-name" : str, "user-num" : int} ] }
        """

        projects = {}
        for user in self.saved_active_users():
            url = f"https://api.intra.42.fr/v2/users/{user['id']}?access_token={self.token}"
            response = requests.get(url)
            projecters = response.json()['projects_users']
            project = ""
            for prod in projecters:
                if not prod["validated?"] and "Piscine" not in prod["project"]["name"]:
                    print(user)
                    project = prod["project"]["name"]
                    print(project)
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
            level += user.cursus_users[-1]['level']
            count += 1
        return ({'average_level':round(level / count, 1)})

    def average_session_hours(self) -> dict:
        """
        Get the average number of hours spent on campus iMacs

        Returns:
            dict: {"average_session_hours": int}
        """

        count = 0
        total = 0
        url = f'https://api.intra.42.fr/v2/campus/{self.campus_id}/locations?access_token={self.token}'
        response = requests.get(url)
        for user in response.json():
            if (user['end_at'] == None):
                current_time = datetime.utcnow()
                user['begin_at'] = user['begin_at'].replace('T', '-')
                user['begin_at'] = user['begin_at'][:user['begin_at'].find('.')]
                begin_at = datetime.strptime(user['begin_at'], "%Y-%m-%d-%H:%M:%S")
                total += (current_time - begin_at).total_seconds()
                count += 1
        return ({"average_session_hours":round(total/count/60/60, 1)})

    def most_recent_submission(self) -> dict:
        """
        Gets the most recent project submissio on for a campus

        Returns:
            dict: {"users":users, "skills":skills, "project":project, "score":score}
        """

        current_time = datetime.utcnow()
        most_recent_user = None
        submissions = []

        _month = current_time.month - 1 if current_time.month - 1 > 0 else 12
        _year = current_time.year if _month != 12 else current_time.year - 1
        for page_num in range(0, 100000):
            url = f"https://api.intra.42.fr/v2/projects_users?filter[campus]=34&filter[marked]=true&range[created_at]={_year}-{_month}-01T00%3A00%3A00.000Z,3000-01-01T00%3A00%3A00.000Z&per_page=100&page={page_num}&access_token={self.token}"
            response = requests.get(url)
            submissions += response.json()
            if (len(response.json()) != 100):
                break
        
        for submission in submissions:
            submission_time = datetime.strptime(submission['marked_at'], "%Y-%m-%dT%H:%M:%S.%fZ")

            if (most_recent_user == None or submission_time > most_recent_user['datetime']):
                    most_recent_user = submission
                    most_recent_user['datetime'] = submission_time
        
        users = []
        for user in most_recent_user['teams'][-1]['users']:
            _temp = {}
            _temp['login'] = user['login']
            _temp['image'] = requests.get(
                                f"https://api.intra.42.fr/v2/users?filter[login]={user['login']}&access_token={self.token}"
                            ).json()[0]['image']['link']
            users.append(_temp)
        
        project = most_recent_user['project']['name']
        score = most_recent_user['final_mark']

        skills = []
        skill_ids = requests.get(f"https://api.intra.42.fr/v2/project_sessions/{most_recent_user['teams'][-1]['project_session_id']}/project_sessions_skills?access_token={self.token}").json()
        for skill_id in skill_ids:
            skill_str = requests.get(f"https://api.intra.42.fr/v2/skills/{skill_id['skill_id']}?access_token={self.token}").json()['slug']
            skills.append(skill_str)

        return ({"users":users, "skills":skills, "project":project, "score":score})

    def cadet_pisciner_ratio(self) -> dict:
        """
        Get the ratio of pisciners to cadets on campus

        Returns:
            dict: { "cadets" : 15, "pisciners":33 }
        """

        cadets = 0
        pisciners = 0
        for user in self.active_user_info:
            if len(user.cursus_users) > 1:
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
            if len(user.cursus_users) > 1:
                for skill in user.cursus_users[-1]['skills']:
                    if (skill['name'] not in skills.keys()):
                        skills[skill['name']] = 0
                        _count[skill['name']] = 0
                    _count[skill['name']] += 1
                    skills[skill['name']] += float(skill['level'])
        
        for skill in skills.keys():
            skills[skill] = round(skills[skill] / _count[skill], 2)

        return (skills)

# SECRET = os.getenv('42_SECRET')
# UID = os.getenv('42_UID')
# t=Token(34, UID, SECRET)
# print(t.most_recent_submission())
