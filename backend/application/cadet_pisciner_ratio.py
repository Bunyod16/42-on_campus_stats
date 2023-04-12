import abc

class CadetPiscinerRatio(abc.ABC):

	@abc.abstractmethod
	def get_token(self):
		pass

	def __init__(self) -> None:
		self.active_user_info = None
		
	def cadet_pisciner_ratio(self) -> dict:
		"""
		Get the ratio of pisciners to cadets on campus

		Returns:
			dict: { "cadets" : 15, "pisciners":33 }
		"""
		cadets = 0
		pisciners = 0
		for user in self.active_user_info:
			if user.is_cadet:
				cadets += 1
			else:
				pisciners += 1
		return ({"cadets":cadets, "pisciners":pisciners})