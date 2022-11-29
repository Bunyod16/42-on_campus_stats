from datetime import datetime
import requests
from dotenv import load_dotenv

load_dotenv()

class Token():
    def __init__(self):
        self.token = _renew_token()
        self.expiry = datetime.now()

    def _renew_token(self):
        UID = os.getenv('42_UID')
        SECRET = os.getenv('42_SECRET')
        headers = {'Content-type':'application/json'}
        r = requests.post(f"https://api.intra.42.fr/oauth/token?grant_type=client_credentials&client_id={UID}&client_secret={SECRET}", headers=headers)
        print(r.json())
        self.token = r.json(['access_token'])
        self.expiry = datetime.now()

t = Token()