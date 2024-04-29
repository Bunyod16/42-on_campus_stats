from flask import jsonify
from .models import Token
import os
from dotenv import load_dotenv
from flask_cors import cross_origin

load_dotenv()

def init_app(app, cache):
    token = Token(
        int(os.getenv("FT_CAMPUS_ID")), os.getenv("FT_API_UID"), os.getenv("FT_API_SECRET")
    )

    token.get_token()

    @app.errorhandler(404)
    def page_not_found(e):
        html = r'<img src="https://api.intra.42.fr/assets/8-sorry.gif" alt="Girl in a jacket" width="100%" height="100%">'
        return html, 404


    @app.route("/", methods=["GET"])
    def index():
        return f"API IS LIVE"


    @app.route("/api/on-campus/active-users", methods=["GET"])
    @cross_origin(send_wildcard=True)
    def active_users():
        return jsonify(token.get_active_users())


    @app.route("/api/on-campus/active-user-projects", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=60)
    def user_projects():
        return jsonify(token.active_user_projects())


    @app.route("/api/on-campus/average-user-level", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=120)
    def feature():
        return jsonify(token.average_user_level())


    @app.route("/api/on-campus/average-session-hours", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=240)
    def average_session_hours():
        return jsonify(token.average_session_hours())


    @app.route("/api/most-recent-submission", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=300)
    def most_recent_submission():
        return jsonify(token.most_recent_submission())


    @app.route("/api/on-campus/cadet-pisciner-ratio", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=120)
    def cadet_pisciner_ratio():
        return jsonify(token.cadet_pisciner_ratio())


    @app.route("/api/on-campus/active-user-skills", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=180)
    def active_user_skills():
        return jsonify(token.active_users_skills())


    @app.route("/api/on-campus/daily-total-active-students", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=180)
    def daily_total_active_users():
        return jsonify(token.get_daily_active_users())


    @app.route("/api/on-campus/weekly-cadet-xp", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=180)
    def weekly_cadet_xp():
        return jsonify(token.get_weekly_cadet_xp())


    @app.route("/api/on-campus/weekly-most-active-users", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=180)
    def weekly_most_active_users():
        return jsonify(token.weekly_most_active_users())


    @app.route("/api/on-campus/weekly-most-gained-xp", methods=["GET"])
    @cross_origin(send_wildcard=True)
    @cache.cached(timeout=180)
    def weekly_most_gained_xp():
        return jsonify(token.weekly_most_gained_xp())
