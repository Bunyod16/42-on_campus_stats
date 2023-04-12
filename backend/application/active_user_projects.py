from datetime import datetime, timedelta
import json
import threading
import logging
from .user import User
import requests
import abc

class ActiveUserProjects(abc.ABC):


	@abc.abstractmethod
	def get_token(self):
		pass

	def __init__(self):
		self.active_user_info = None

	def active_user_projects(self) -> dict:
		"""
		Get data about projects being worked on at campus

		Returns:
			dict: {"projects" : [ {"project-name" : str, "user-num" : int} ] }
		"""

		projects = {}
		for user in self.active_user_info:
			projecters = user.projects_users
			project = ""
			for prod in projecters:

				#skip unfinished projects
				if (user.is_cadet and 21 not in prod['cursus_ids']):
					continue
				if not prod["validated?"]:
					project = prod["project"]["name"]
					break
			if project not in projects.keys() and project:
				projects[project] = 0
			if project:
				projects[project] += 1
		return (projects)