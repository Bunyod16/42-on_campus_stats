# from flask import Flask
# from flask_caching import Cache
# from . import logging_config

# logging_config.setup_logging()

# config = {
#     "DEBUG": True,
#     "CACHE_TYPE": "SimpleCache",
#     "CACHE_DEFAULT_TIMEOUT": 120
# }

# app = Flask(__name__)
# cache = Cache(app)
# app.config.from_mapping(config)

# from application import routes

from flask import Flask
from flask_caching import Cache
from flask_cors import CORS
from . import logging_config

def create_app(config=None):
    # Set up logging
    logging_config.setup_logging()

    # Create a Flask app instance
    app = Flask(__name__)

    # Default configuration
    default_config = {
        "DEBUG": True,
        "CACHE_TYPE": "SimpleCache",
        "CACHE_DEFAULT_TIMEOUT": 300  # Adjusted to demonstrate overriding
    }
    
    # If a specific config is provided, use it; otherwise, use the default
    if config:
        app.config.update(config)
    else:
        app.config.update(default_config)

    # Initialize cache with the app
    cache = Cache(app)
    CORS(app, resources={r"/*": {"origins": "http://10.52.2.3:3000"}})

    # Import and register routes (Blueprints, if applicable)
    from . import routes
    routes.init_app(app, cache)  # Assuming routes has an init_app function for registering blueprints

    return app
