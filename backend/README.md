# How to run

- Navigate /backend

```
cd backend
```

- Create a virtual environment in python

```
python3 -m venv venv
```

- Install dependencies

```
pip install -r requirements.txt
```

- Create .env file with secrets, you may find your API keys [on the intra](https://profile.intra.42.fr/oauth/applications/new), create a new application if you dont have one. <br>
  
```
touch .env
```

- .env file example

```
FT_API_UID = "YOUR_UID_HERE"
FT_API_SECRET = "YOUR_SECRET_HERE"
FT_CAMPUS_ID = "YOUR_CAMPUS_ID_HERE"
```

- Run the backend
```
flask run
```