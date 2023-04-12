import requests
import abc
from datetime import datetime

class AverageSessionHours(abc.ABC):

	@abc.abstractmethod
	def get_token(self):
		pass

	def __init__(self) -> None:
		self.active_user_info = None
		
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