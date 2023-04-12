import abc

class ActiveUsersSkills(abc.ABC):

	@abc.abstractmethod
	def get_token(self):
		pass

	def __init__(self) -> None:
		self.active_user_info = None
		
	def active_users_skills(self):
		"""
		Get skills of cadets on campus

		Returns:
			dict: {'Skill name': int}
		"""

		skills = {}
		_count = {}
		for user in self.active_user_info:

			if user.is_cadet:
				for skill in user.cursus_users[-1]['skills']:
					if (skill['name'] not in skills.keys()):
						skills[skill['name']] = 0
						_count[skill['name']] = 0
					_count[skill['name']] += 1
					skills[skill['name']] += float(skill['level'])
		
		for skill in skills.keys():
			skills[skill] = round((skills[skill] * 2.5) / _count[skill], 2)

		return (skills)