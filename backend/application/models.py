from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv
import time
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
    def get_all_user_info(self):
        # info = []
        # result_len = 100
        # i = 0
        # while(result_len == 100):
        #     url = f"https://api.intra.42.fr/v2/campus/{self.campus_id}/users?per_page=100&page={i}&access_token={self.token}"
        #     response = requests.get(url)
        #     print(response.json())
        #     result_len = len(response.json())
        #     info += response.json()
        #     i += 1
        i = 0
        url = f"https://api.intra.42.fr/v2/projects_users?filter[campus]=34&filter[marked]=true&range[created_at]=2022-01-01T00%3A00%3A00.000Z,3000-01-01T00%3A00%3A00.000Z&access_token={self.token}"
        response = requests.get(url)
        with open("somef.json","w") as f:
            f.write(json.dumps(response.json()))
        exit()
        info.append(user)
        return (info)

    def get_active_user_info(self):
        info = []
        for user in self.saved_active_users():
            url = f"https://api.intra.42.fr/v2/users/{user['id']}?access_token={self.token}"
            response = requests.get(url)
            user = User(response.json())
            info.append(user)
        return (info)

    def _renew_token(self):
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
        # self.allcampus_users = self.get_all_user_info()
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
        print(len(self.active_users))
        return self.active_users

    def active_user_projects(self):        
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

    def average_user_level(self):
        level = 0
        count = 0
        for user in self.active_user_info:
            level += user.cursus_users[-1]['level']
            count += 1
        return ({'average_level':round(level / count, 1)})

    def average_session_hours(self):
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

    def most_recent_submission(self):
        current_time = datetime.utcnow()
        most_recent_time = None
        most_recent_user = None
        for user in self.allcampus_users:
            print(user)
            for project in (user.projects_users):
                if (project['marked'] == True):
                    user['marked_at'] = user['marked_at'].replace('T', '-')
                    user['marked_at'] = user['marked_at'][:user['marked_at'].find('.')]
                    marked_at = datetime.strptime(user['marked_at'], "%Y-%m-%d-%H:%M:%S")
                    recency = (current_time - marked_at).total_seconds()
                    if (most_recent_time is None or recency < most_recent_time):
                        most_recent_user = user
        return (most_recent_user)


# SECRET = os.getenv('42_SECRET')
# UID = os.getenv('42_UID')
# t=Token(34, UID, SECRET)
# print(t.most_recent_submission())
