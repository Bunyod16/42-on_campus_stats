from application import app
from flask import jsonify
from .models import Token
import os

token = Token(34, "u-s4t2ud-7955af256978a28c3c35fb31017a7dd4bad00f5b93ba094019054685716cc667", "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")

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
