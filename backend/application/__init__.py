from flask import Flask
from flask_caching import Cache
from . import logging_config

logging_config.setup_logging()

config = {
    "DEBUG": True,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 120
}

app = Flask(__name__)
cache = Cache(app)
app.config.from_mapping(config)

from application import routes