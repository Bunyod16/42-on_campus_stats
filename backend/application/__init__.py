from flask import Flask
from flask_caching import Cache
from . import logging_config
from flask_cors import CORS

logging_config.setup_logging()

config = {
    "DEBUG": True,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 120
}

app = Flask(__name__)
cache = Cache(app)
CORS(app)
app.config.from_mapping(config)

from application import routes