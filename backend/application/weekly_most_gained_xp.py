import requests
import abc
import logging
import json
from .user import User
from datetime import datetime, timedelta


class WeeklyMostGainedXp(abc.ABC):

    @abc.abstractmethod
    def get_token(self):
        pass

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

        def is_more_than_one_week_ago(date_string):
            # Parse the input string into a datetime object
            input_date = datetime.strptime(
                date_string, '%Y-%m-%dT%H:%M:%S.%fZ')

            # Calculate the date one week ago
            one_week_ago = datetime.now() - timedelta(days=7)

            # Check if the input date is earlier than one week ago
            return input_date < one_week_ago

        users = {}
        for session in total_xp:
            login = session['user']['login']
            xp = int(session['experience'])
            if (is_more_than_one_week_ago(session['created_at'])):
                continue

            if (login not in users.keys()):
                users[login] = {'login': login, 'xp': 0,
                                'id': session['user']['id']}
            users[login]['xp'] += int(xp)

        users = dict(
            sorted(users.items(), key=lambda item: item[1]['xp'], reverse=True))
        top_five = []
        for key, value in users.items():
            if len(top_five) == 5:
                break
            value['image'] = get_image(self.get_token(), value['id'])
            top_five.append(value)

        return top_five
