from datetime import datetime, timedelta
import json
import threading
import logging
from .user import User
import requests
import abc


class ActiveUsers(abc.ABC):

    @abc.abstractmethod
    def get_token(self):
        pass

    def get_active_user_info(self):
        """Querry percise information about every single saved user on campus

        Returns:
                _type_: _description_
        """
        # get info about every active user on campus
        logging.debug("Querrying for active users")
        temp = []
        for page in range(0, 10000):
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

        # save info as json, to pass between proccesses
        print("saved active user info")
        with open("active_user_info.json", "w") as _f:
            _f.write(json.dumps(json_data))
        return (info)

    def __init__(self) -> None:
        self.user_info_timeout = None
        self.campus_id = None

    def get_active_users(self):
        # return info in a pretty format
        if datetime.now() > self.user_info_timeout:
            logging.debug("User info timed out, requerry")
            active_users_querry = threading.Thread(
                target=self.get_active_user_info)
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
