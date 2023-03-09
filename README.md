# 42 On Campus Statistics

- Greetings
- How did this project started.
- Purpose

## Installation

<details>
<summary style="font-size: 1.25em;font-weight: bold;">Frontend</summary>

- Navigate /frontend

```bash
cd frontend
```

- Install dependencies

```bash
pnpm install
```

- Run frontend

```bash
pnpm start
```

</details>
<details>
<summary style="font-size: 1.25em;font-weight: bold;">Backend</summary>

- Navigate /backend

```bash
cd backend
```

- Create a virtual environment in python

```bash
python3 -m venv venv
```

- Install dependencies

```bash
pip install -r requirements.txt
```

- Create .env file with secrets, you may find your API keys [on the intra](https://profile.intra.42.fr/oauth/applications/new), create a new application if you dont have one. <br>

```bash
touch .env
```

- .env file example

```python
CAMPUS_UID = "YOUR_UID_HERE"
CAMPUS_SECRET = "YOUR_SECRET_HERE"
CAMPUS_ID = "YOUR_CAMPUS_ID_HERE"
```

- Run the backend

```bash
flask run
```

</details>

## Usage

- Something
- Something

## How To Contribute

- Please fork to use it on ur own campus

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
