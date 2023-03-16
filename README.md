<a name="readme-top"></a>

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://i.imgur.com/hyM3NoY.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Campus Statistics Dashboard</h3>

  <p align="center">
    An awesome tool to give LIVE insights about your 42 campus
    <br />
    <br />
    <a href="https://42-on-campus-stats.vercel.app" target="_blank">View Demo</a>
    ·
    <a href="https://github.com/Bunyod16/42-on_campus_stats/issues">Report Bug</a>
    ·
    <a href="https://github.com/Bunyod16/42-on_campus_stats/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Screenshot][product-screenshot]](https://42-on-campus-stats.vercel.app)

Due to the structure of the campus building in Kuala Lumpur, it was hard for bocals to gauge the amount of cadets present at any given time, the time they were spending on projects and measure productivity overall. That sparked an idea to create a web app to be hosted on a TV at the entrance of the campus.
<br/>
It gives useful insights about who is on campus, what projects are they doing/finished aswell as give a little morale boost to the Cadets.
<br/>
<b>Please keep in mind that its best to view it on a TV.</b>

### Built with

[![React][react]][react-url]
[![Flask][flask]][flask-url]

### Deployed on

[![Vercel][vercel]][vercel-url]
[![Render][render]][render-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation & Usage

<details>
<summary style="font-size: 1.25em;font-weight: bold;">Frontend</summary>

-   Navigate /frontend

```bash
cd frontend
```

-   Install dependencies

```bash
pnpm install
```

-   Run frontend

```bash
pnpm start
```

</details>
<details>
<summary style="font-size: 1.25em;font-weight: bold;">Backend</summary>

-   Navigate /backend

```bash
cd backend
```

-   Create a virtual environment in python

```bash
python3 -m venv venv
```

-   Install dependencies

```bash
pip install -r requirements.txt
```

-   Create .env file with secrets, you may find your API keys [on the intra](https://profile.intra.42.fr/oauth/applications/new), create a new application if you dont have one. <br>

```bash
touch .env
```

-   .env file example

```python
CAMPUS_UID = "YOUR_UID_HERE"
CAMPUS_SECRET = "YOUR_SECRET_HERE"
CAMPUS_ID = "YOUR_CAMPUS_ID_HERE"
```

-   Run the backend

```bash
flask run
```

</details>

<!-- ## Usage -->
<!-- ROADMAP -->

## Roadmap

-   [x] Deploy project
-   [x] Connecting Frontend with Backend
-   [x] Configure view to fit tv
-   [x] Replace skills chart with something more useful
    -   [x] Remove skill spider chart
    -   [x] Add Top 5 most online users per week
    -   [x] Add Top 5 most experienced gained per week
-   [x] Convert Styled Components to use Tailwind CSS
-   [ ] Auto refresh TV when new deployment happen
-   [ ] Refactor Code
-   [ ] Update User Interface
-   [ ] Change Color Scheme

See the [open issues](https://github.com/Bunyod16/42-on_campus_stats/issues) for a full list of proposed features (and known issues).

## How To Contribute

-   Kindly fork this repo if you wish to use it on your own campus.

-   Pull requests are welcome. For major changes, please open an issue first
    to discuss what you would like to change.

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

-   [Bunyod](https://github.com/Bunyod16) for the initial idea and backend contribution
-   [Jaclyn](https://github.com/Jachokoreto) for the frontend and UI/UX
-   [Jason](https://github.com/jasonkwm) for frontend
-   [Kevin](https://github.com/locorocorolling) for helping with Bug Fixes

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/Bunyod16/42-on_campus_stats/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-shield]: https://img.shields.io/badge/ISSUES-OPEN-yellow?style=for-the-badge&logo=googlecloud
[issues-url]: https://github.com/Bunyod16/42-on_campus_stats/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://www.mit.edu/~amini/LICENSE.md
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: https://i.imgur.com/Rr8fehO.png
[flask]: https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white
[flask-url]: https://flask.palletsprojects.com/en/2.2.x/
[django]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=django&logoColor=61DAFB
[react-url]: https://reactjs.org/
[react]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[vercel-url]: https://vercel.com/
[vercel]: https://img.shields.io/badge/vercel-20232A?style=for-the-badge&logo=vercel&logoColor=61DAFB
[render-url]: https://render.com/
[render]: https://img.shields.io/badge/render-20232A?style=for-the-badge&logo=render&logoColor=61DAFB

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/Bunyod16/42-on_campus_stats/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-shield]: https://img.shields.io/badge/ISSUES-OPEN-yellow?style=for-the-badge&logo=googlecloud
[issues-url]: https://github.com/Bunyod16/42-on_campus_stats/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://www.mit.edu/~amini/LICENSE.md
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: https://i.imgur.com/Rr8fehO.png
[flask]: https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white
[flask-url]: https://flask.palletsprojects.com/en/2.2.x/
[django]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=django&logoColor=61DAFB
[react-url]: https://reactjs.org/
[react]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[vercel-url]: https://vercel.com/
[vercel]: https://img.shields.io/badge/vercel-20232A?style=for-the-badge&logo=vercel&logoColor=61DAFB
[render-url]: https://render.com/
[render]: https://img.shields.io/badge/render-20232A?style=for-the-badge&logo=render&logoColor=61DAFB
