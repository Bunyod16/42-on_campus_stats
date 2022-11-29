import os
from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)

mongo_client = PyMongo(app, uri=os.getenv('MONGO_URI'))
from application import routes