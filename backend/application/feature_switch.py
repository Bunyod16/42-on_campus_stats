import re
from flask import jsonify
from .models import User

def validate_email(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

    if re.fullmatch(regex, email):
        return True
    else:
        return False

def get_feature(email, feature_name):
    if email is None or feature_name is None:
        return jsonify({'message':'Error missing required parameters email/featureName'}), 422
    if not validate_email(email):
        return jsonify({'message':'Error malformed email'}), 422
    user = User(email)
    if feature_name in user.doc.get('features'):
        return jsonify({'canAccess':True}), 200
    return jsonify({'canAccess':False}), 200

def post_feature(email, feature_name, enable):
    if (email is None
        or feature_name is None
        or enable is None):
        return '', 304

    if (not isinstance(email, str)
        or not isinstance(feature_name, str)
        or not isinstance(enable, bool)):
        return '', 304

    if not validate_email(email):
        return '', 304

    user = User(email)
    if user.doc is None:
        return '', 304

    try:
        features = user.doc.get('features')
        if (enable and feature_name not in features):
            features.append(feature_name)
        elif (not enable and feature_name in features):
            features.remove(feature_name)
    except Exception as err:
            print(err)
            return '', 304
    result = user.update({"$set": {"features": features}})
    if result.acknowledged:
        return jsonify('OK'), 200
    return '', 304
