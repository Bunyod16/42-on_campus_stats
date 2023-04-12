import requests
import abc
import logging
import json
from datetime import datetime, timedelta
import threading


class WeeklyCadetXp(abc.ABC):

    @abc.abstractmethod
    def get_token(self):
        pass

    def __init__(self) -> None:
        self.weekly_cadet_xp = None
        self.weekly_cadet_xp_timeout = None
        self.campus_id = None

    def load_weekly_cadet_xp(self):
        logging.debug("Loading daily weekly cadet xp")
        response = None
        dates = {}
        _now = datetime.now()
        days_since_monday = _now.today().weekday()
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
            dates[_now.isoformat()] = sum(int(user['experience'])
                                          for user in day_xp)
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
