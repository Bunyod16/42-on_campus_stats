import abc
import logging
import json
from .user import User
from datetime import datetime
from zoneinfo import ZoneInfo

class WeeklyMostActiveUsers(abc.ABC):

    @abc.abstractmethod
    def get_token(self):
        pass

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
            # if (login == "melee"):
            #     print(session['begin_at'], session['end_at'])
            begin_at = datetime.strptime(session['begin_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
            if (not session['end_at']):
                end_at = datetime.now(ZoneInfo("Europe/Amsterdam"))
                end_at = end_at.replace(tzinfo=None)

            else:
                end_at = datetime.strptime(session['end_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
            
            difference = (end_at - begin_at).total_seconds() / 3600 #difference in hours
            if (difference >= 24):
                difference = 12
            # if (login == "melee"):
            #     print(print(difference))
            #     print()
            if (login not in users.keys()):
                users[login] = {'login':login, 'hours':0, 'image':session['user']['image']['link']}
            users[login]['hours'] += int(difference) 

        users = dict(sorted(users.items(), key=lambda item: item[1]['hours'], reverse=True))
        top_five = []
        for _, value in users.items():
            if len(top_five) == 5:
                break
            top_five.append(value)

        return top_five