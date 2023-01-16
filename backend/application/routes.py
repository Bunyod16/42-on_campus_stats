from application import app
from flask import jsonify
from .models import Token
import os
from dotenv import load_dotenv

load_dotenv()

env_uid = os.getenv("42_UID")
env_secret = os.getenv("42_SECRET")

token = Token(34, env_uid, env_secret)

@app.errorhandler(404)
def page_not_found(e):
    html = r'<img src="https://api.intra.42.fr/assets/8-sorry.gif" alt="Girl in a jacket" width="100%" height="100%">'
    return html, 404

@app.route('/', methods=['GET'])
def index():
    return ("API IS LIVE")

@app.route('/api/on-campus/active-users', methods=['GET'])
def active_users():
    return (jsonify(token.get_active_users()))

@app.route('/api/on-campus/active-user-projects', methods=['GET'])
def user_projects():
    return (jsonify(token.active_user_projects()))

@app.route('/api/on-campus/average-user-level', methods=['GET'])
def feature():
    return (jsonify(token.average_user_level()))

@app.route('/api/on-campus/average-session-hours', methods=['GET'])
def average_session_hours():
    return (jsonify(token.average_session_hours()))

@app.route('/api/most-recent-submission', methods=['GET'])
def most_recent_submission():
    return (jsonify(token.most_recent_submission()))

@app.route('/api/on-campus/cadet-pisciner-ratio', methods=['GET'])
def cadet_pisciner_ratio():
    return (jsonify(token.cadet_pisciner_ratio()))

@app.route('/api/on-campus/active-user-skills', methods=['GET'])
def active_user_skills():
    return (jsonify(token.active_users_skills()))

@app.route('/api/on-campus/daily-total-active-students', methods=['GET'])
def daily_total_active_users():
    pass



#/api/on-campus/active-users
#/api/on-campus/active-user-projects
#/api/on-campus/average-user-level
#/api/on-campus/average-session-time
#/api/most-recent-submission
#/api/on-campus/daily-total-active-students
#/api/on-campus/cadet-pisciner-ratio
#/api/on-campus/active-user-skills
