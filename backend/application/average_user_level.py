import logging
import abc

class AverageUserLevel(abc.ABC):

	@abc.abstractmethod
	def get_token(self):
		pass

	def __init__(self) -> None:
		self.active_user_info = None
		
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