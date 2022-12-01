from application import app
from flask import jsonify
from .models import Token

SECRET = os.getenv('42_SECRET')
UID = os.getenv('42_UID')
t=Token(34, UID, SECRET)

@app.route('/api/on-campus/active-users', methods=['GET'])
def active_users():
    return (jsonify(token.get_active_users()))

@app.route('/api/on-campus/active-user-projects', methods=['GET'])
def user_projects():
    return (jsonify(token.active_user_projects()))

@app.route('/api/on-campus/average-user-level', methods=['GET'])
def feature():
    return (jsonify(token.average_user_level()))

@app.route('/api/on-campus/average-session-time', methods=['GET'])
def average_session_time():
    return (jsonify(token.average_session_time()))

@app.route('/api/most-recent-submission', methods=['GET'])
def most_recent_submission():
    return (jsonify(token.most_recent_submission()))

@app.route('/api/on-campus/daily-total-active-students', methods=['GET'])
def daily_total_active_users():
    pass

@app.route('/api/on-campus/cadet-pisciner-ratio', methods=['GET'])
def cadet_pisciner_ratio():
    pass

@app.route('/api/on-campus/active-user-skills', methods=['GET'])
def active_user_skills():
    pass

#/api/on-campus/active-users
#/api/on-campus/active-user-projects
#/api/on-campus/average-user-level
#/api/on-campus/average-session-time
#/api/most-recent-submission
#/api/on-campus/daily-total-active-students
#/api/on-campus/cadet-pisciner-ratio
#/api/on-campus/active-user-skills
