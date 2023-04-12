import requests
import abc
import logging
from datetime import datetime, timedelta

class MostRecentSubmission(abc.ABC):

	@abc.abstractmethod
	def get_token(self):
		pass

	def __init__(self) -> None:
		self.active_user_info = None
	
	def most_recent_submission(self) -> dict:
		"""
		Gets the most recent project submission on for a campus

		Returns:
			dict: {"users":users, "skills":skills, "project":project, "score":score}
		"""

		_now = datetime.now() + timedelta(days=7) #just make it into the future to get everything
		_week_ago = datetime.now() - timedelta(days=7)
		logging.debug(f"Querry for most recent submission, with time between {_now}, {_week_ago}")
		url = f"https://api.intra.42.fr/v2/projects_users?range[final_mark]=50,200&filter[campus]={self.campus_id}&filter[marked]=true&range[marked_at]={_week_ago.year}-{_week_ago.month}-{_week_ago.day}T00%3A00%3A00.000Z,{_now.year}-{_now.month}-{_now.day}T00%3A00%3A00.000Z&per_page=100&page=0&access_token={self.get_token()}"
		response = requests.get(url)

		if (not response.ok):
			logging.error("Intra returned not ok for most_recent")
			return {}

		def convert_time(date_string):
			return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ")

		newlist = sorted(response.json(), key=lambda d: convert_time(d['updated_at'])) 
		seen_teams = set()
		latest_submissions = [d for d in newlist if d['current_team_id'] not in seen_teams and not seen_teams.add(d['current_team_id'])]
		latest_submissions = latest_submissions[-3:]

		submissions = []
		for submission in latest_submissions:
			users = []
			for user in submission['teams'][0]['users']:
				_temp = {}
				_temp['login'] = user['login']
				_temp['image'] = requests.get(
									f"https://api.intra.42.fr/v2/users?filter[login]={user['login']}&access_token={self.get_token()}"
								).json()[0]['image']['link']
				if not _temp['image']:
					_temp['image'] = "https://i.imgur.com/F0zhHes.jpg"
				users.append(_temp)
			project = submission['project']['name']
			score = submission['final_mark']
			seconds_since_submission = (datetime.now() - datetime.strptime(submission['updated_at'], "%Y-%m-%dT%H:%M:%S.%fZ")).total_seconds()
			if seconds_since_submission <= 3600:
				time_string = f"{int(seconds_since_submission / 60)} minutes ago"
			else:
				time_string = f"{int(seconds_since_submission / 60 / 60)} hours ago"
			submissions.append({"users":users, "project":project, "score":score, "time":time_string})
		
		return (submissions)