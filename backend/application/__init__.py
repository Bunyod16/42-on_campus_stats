from flask import Flask
from . import logging_config

logging_config.setup_logging()


app = Flask(__name__)

from application import routes