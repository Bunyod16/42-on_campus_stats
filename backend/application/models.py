from datetime import datetime, timedelta, date
import requests
from dotenv import load_dotenv
import logging
import threading
import json

from .active_users import ActiveUsers
from .active_user_projects import ActiveUserProjects
from .average_user_level import AverageUserLevel
from .average_session_hours import AverageSessionHours
from .cadet_pisciner_ratio import CadetPiscinerRatio
from .most_recent_submission import MostRecentSubmission
from .weekly_most_gained_xp import WeeklyMostGainedXp
from .weekly_most_active_users import WeeklyMostActiveUsers
from .active_users_skills import ActiveUsersSkills
from .weekly_cadet_xp import WeeklyCadetXp

load_dotenv()


class Token(
    ActiveUsers,
    ActiveUserProjects,
    AverageUserLevel,
    ActiveUsersSkills,
    AverageSessionHours,
    CadetPiscinerRatio,
    MostRecentSubmission,
    WeeklyMostGainedXp,
    WeeklyMostActiveUsers,
    WeeklyCadetXp,
):

    def get_token(self):
        """Get the 42 API token, renew if expired"""
        if datetime.now() > self._token_expiration - timedelta(seconds=60):
            logging.debug("API token expired")
            headers = {"Content-type": "application/json"}
            r = requests.post(
                f"https://api.intra.42.fr/oauth/token?grant_type=client_credentials&client_id={self.uid}&client_secret={self.secret}",
                headers=headers,
            )
            print("REQUEST JSON ACCESS TOKEN", r.json())
            self._token = r.json()["access_token"]
            self._token_expiration = datetime.now() + timedelta(
                seconds=r.json()["expires_in"]
            )
        return self._token

    def __init__(self, campus_id, uid, secret):
        self.uid = uid
        self.secret = secret
        self.campus_id = campus_id

        self._token = None
        self._token_expiration = datetime.now()

        self.active_user_info = self.get_active_user_info()
        self.user_info_timeout = datetime.now() + timedelta(minutes=30)

        self.weekly_cadet_xp = self.load_weekly_cadet_xp()
        self.weekly_cadet_xp_timeout = datetime.now() + timedelta(hours=6)

        self.week_active_users = {}
        self.user_info_timeout = datetime.now() + timedelta(minutes=30)

        self.daily_active_users = self.load_daily_active_users()
        self.daily_users_timeout = datetime.now() + timedelta(minutes=30)

    def load_daily_active_users(self):
        logging.debug("Loading daily user data from last 7 days")
        response = None
        week_sessions = []
        _now = datetime.now() + timedelta(days=1)
        _week_ago = _now - timedelta(days=7)
        logging.debug(f"Querry for daily active users between {_now} and {_week_ago}")
        for page in range(0, 1000):
            url = f"https://api.intra.42.fr/v2/campus/{self.campus_id}/locations?sort=begin_at&per_page=100&page={page}&range[begin_at]={_week_ago.year}-{_week_ago.month}-{_week_ago.day}T00%3A00%3A00.000Z,{_now.year}-{_now.month}-{_now.day}T23%3A59%3A00.000Z&access_token={self.get_token()}"
            response = requests.get(url)

            for session in response.json():
                week_sessions.append(session)
            if len(response.json()) < 100:
                break

        with open("week_sessions.json", "w") as _f:
            _f.write(json.dumps(week_sessions))

        dates = {}

        for session in week_sessions:
            start_time = datetime.strptime(
                session["begin_at"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date()
            if (
                f"{start_time.year} {start_time.month} {start_time.day}"
                not in dates.keys()
            ):
                dates[f"{start_time.year} {start_time.month} {start_time.day}"] = []
            if (
                session["user"]["login"]
                not in dates[f"{start_time.year} {start_time.month} {start_time.day}"]
            ):
                dates[f"{start_time.year} {start_time.month} {start_time.day}"].append(
                    session["user"]["login"]
                )

        temp = {}
        for day in dates.keys():
            date_obj = datetime.strptime(day, "%Y %m %d")
            date_obj = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
            temp[date_obj.isoformat()] = len(dates[day])
        with open("daily_active_users.json", "w") as _f:
            _f.write(json.dumps(temp))
        return temp

    def get_daily_active_users(self):
        with open("daily_active_users.json", "r") as _f:
            self.daily_active_users = json.loads(_f.read())
        if datetime.now() > self.daily_users_timeout:
            self.daily_users_timeout = datetime.now() + timedelta(minutes=30)
            thread = threading.Thread(target=self.load_daily_active_users)
            thread.start()
        return self.daily_active_users
