<p align="left">
   <img src=".github/delivery-icon.gif" width="200"/>
</p>

# GoEat

> Rest API for Food Delivery Businesses, providing fast and clean service for providers and users.

[![Author](https://img.shields.io/badge/author-LauraBeatris-F9B35F?style=flat-square)](https://github.com/LauraBeatris)
[![Languages](https://img.shields.io/github/languages/count/LauraBeatris/goeat-api?color=%23F9B35F&style=flat-square)](#)
[![Stars](https://img.shields.io/github/stars/LauraBeatris/goeat-api?color=F9B35F&style=flat-square)](https://github.com/LauraBeatris/goeat-api/stargazers)
[![Forks](https://img.shields.io/github/forks/LauraBeatris/goeat-api?color=%23F9B35F&style=flat-square)](https://github.com/LauraBeatris/goeat-api/network/members)
[![Contributors](https://img.shields.io/github/contributors/LauraBeatris/goeat-api?color=F9B35F&style=flat-square)](https://github.com/LauraBeatris/goeat-api/graphs/contributors)

# :pushpin: Table of Contents

* [Features](#rocket-features)
* [Installation](#construction_worker-installation)
* [Getting Started](#runner-getting-started)
* [FAQ](#postbox-faq)
* [Found a bug? Missing a specific feature?](#bug-issues)
* [Contributing](#tada-contributing)
* [License](#closed_book-license)

# :rocket: Features

*  🍽 Schedule appointments in restaurants
*  🛵 Request food orders
*  👩‍💼 Manage restaurants
*  📁 Files upload
*  👩🏻‍💻 Provider and user interface

# :construction_worker: Installation

**You need to install [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/) first, then in order to clone the project via HTTPS, run this command:**

```git clone https://github.com/LauraBeatris/goeat-api.git```

SSH URLs provide access to a Git repository via SSH, a secure protocol. If you use a SSH key registered in your Github account, clone the project using this command:

```git clone git@github.com:LauraBeatris/goeat-api.git```

**Install dependencies**

```yarn install```

Create your enviroment variables based on the examples of ```.env.example```

```cp .env.example .env```

After copying the examples, make sure to fill the variables with new values.

**Setup a database**

Install [Postgres](https://www.postgresql.org/) to create a database or if you have [Docker](https://www.docker.com/) in your machine, fill the environment values related to database configurations and then run the following commands in order to create a postgres container.

```docker-compose up```

Check if the containers are running

``` docker ps ```

# :runner: Getting Started

Run the transactions in order to configure all the database schemas

```yarn typeorm migration:run```

Run the following command in order to start the application in a development environment:

```yarn dev```

Run the following command to run the queue responsable for the mail job

``` yarn queue-dev ```

# Run in production

Run the following command in order to start the application in a production environment:

```yarn start```

Run the following command to run the queue responsable for the mail job

``` yarn queue ```

# :postbox: Faq

**Question:** What are the tecnologies used in this project?

**Answer:** The tecnologies used in this project are [NodeJS](https://nodejs.org/en/) + [Express Framework](http://expressjs.com/en/) to handle the server and [Sequelize](https://sequelize.org/)

## Status Codes

Goeat returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 422 | `UNPROCESSABLE ENTITY` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

# :bug: Issues

Feel free to **file a new issue** with a respective title and description on the the [GoEat API](https://github.com/LauraBeatris/goeat-api/issues) repository. If you already found a solution to your problem, **i would love to review your pull request**! Have a look at our [contribution guidelines](https://github.com/LauraBeatris/goeat-api/blob/master/CONTRIBUTING.md) to find out about the coding standards.

# :tada: Contributing

Check out the [contributing](https://github.com/LauraBeatris/goeat-api/blob/master/CONTRIBUTING.md) page to see the best places to file issues, start discussions and begin contributing.

# :closed_book: License

Released in 2020.
This project is under the [MIT license](https://github.com/LauraBeatris/foodfy/master/LICENSE).

Made with love by [Laura Beatris](https://github.com/LauraBeatris) 💜🚀
