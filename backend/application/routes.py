from flask import request, make_response
from application import feature_switch
from application import app

@app.route('/api/on-campus/active-users', methods=['GET'])
def active_users():
    if not set(['email', 'featureName', 'enable']).issubset(set(request.json.keys())):
        return make_response("", 304)
    return make_response(feature_switch.post_feature(
            request.json['email'],
            request.json['featureName'],
            request.json['enable']
            )
        )

@app.route('/api/on-campus/active-user-projects', methods=['GET'])
def user_projects():
    pass

@app.route('/api/on-campus/average-user-level', methods=['GET'])
def feature():
    pass

@app.route('/api/on-campus/average-session-time', methods=['GET'])
def average_session_time():
    pass

@app.route('/api/most-recent-submission', methods=['GET'])
def most_recent_submission():
    pass

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
