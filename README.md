# Cloudly - A cloud storage web application

A fullstack cloud storage application inspired major cloud service applications. Supports file uploads, hierarchical folder organization, and secure cloud based storage. Built to practice full stack architecture, and database management using Prisma ORM.

## Table of contents

- [Cloudly - A cloud storage web application](#cloudly---a-cloud-storage-web-application)
  - [Table of contents](#table-of-contents)
  - [App Showcase](#app-showcase)
  - [Introduction](#introduction)
    - [Features](#features)
    - [Limitations](#limitations)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Other Tech](#other-tech)
  - [Project Structure](#project-structure)
  - [Installation \& Setup Guide](#installation--setup-guide)
    - [1. Prerequisites](#1-prerequisites)
    - [2. Clone the Repository](#2-clone-the-repository)
    - [3. Install Dependencies](#3-install-dependencies)
    - [4. Environment Configuration](#4-environment-configuration)
      - [Important:](#important)
    - [5. Database setup](#5-database-setup)
    - [6. Start the Application](#6-start-the-application)
    - [7. Access the Application](#7-access-the-application)
    - [Assumptions](#assumptions)
  - [Acknowledgements](#acknowledgements)
  - [Contact](#contact)
  - [License](#license)

## App Showcase

| Homepage desktop view                                          |
| -------------------------------------------------------------- |
| <img max-width="80vw" src="./public/images/desktop-nolog.png"> |

| Homepage desktop view (Logged in and Dark mode)                        |
| ---------------------------------------------------------------------- |
| <img max-width="80vw" src="./public/images/desktop-loggedin-dark.png"> |

| Homepage smartphone view                                                | Homepage smartphone (After Logged in)                                 |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| <img max-width="80vw" src="./public/images/smartphone-dark-nolog.png" > | <img max-width="80vw" src="./public/images/smartphone-loggedin.png" > |

| Sign up page (Desktop)                                          |
| --------------------------------------------------------------- |
| <img max-width="80vw" src="./public/images/desktop-signup.png"> |

## Introduction

This is a full-stack web based cloud storage application built as a part of project submission in [The Odin Project]() full-stack web development curriculum. Allows most features of a real cloud storage services.

### Features

- Stores your files in a real cloud.
- Create folders to organize your files.
- Delete your files from cloud.
- Delete a folder and all their contents recursively in just one click.
- Use Passport.js to authenticate users by intensionally using only simple username and password for simplicity and easy signup.
- No limit on number of files user can store
- Support dual theme with toggle button in the header
- HTML + javascript + backend (using express-validator) form data validation.

### Limitations

- Intensionally allow only 3 files upload at once.
- Intensionally restrict each file size to max 5MB.
- Only only Images and PDFs uploads.

## Tech Stack

### Frontend

- Javascript
- HTML
- CSS
- React

### Backend

- NodeJS
- Express
- Passpost.js
- pg (postgres)
- EJS
- SQL
- Prisma ORM
- Postman
- Cloudinary

### Other Tech

- ESlint
- VS code
- Jest
- NPM
- Git
- Figma

## Project Structure

```
cloudly-drive-app
|-- app.js
|-- package.json
|-- package.lock.json
|-- \controllers
|    |-- controller.js
|    |-- folderController.js
|
|-- \routes
|    |-- indexRouter.js
|    |-- logInRouter.js
|    |-- signUpRouter.js
|    |-- foldersRouter.js
|
|-- \prisma
|    |-- schema.prisma
|    |-- \migrations
|
|-- \db
|    |-- queries.js
|
|-- \views        # contains ejs templates and pages
|    |-- \partials #store reusable templates
|    |-- \errors #store error pages
|
|-- \public       # contains static files
|    |-- \icons
|    |-- \images
|    |-- \icons
|    |-- \scripts
|    |-- \styles
|    |-- \fonts
|
|-- .gitignore
|-- .env
|-- README.md
|-- LICENSE
```

## Installation & Setup Guide

### 1. Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- PostgreSQL (running locally or hosted)
- Git

Verify installations your terminal:

```bash
node -v
npm -v
psql --version
git --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/yashu483/cloudly-drive-app.git
cd cloudly-drive-app
```

### 3. Install Dependencies

```bash
npm install
```

> `node_modules` is intentionally excluded from version control and will be generated locally.

### 4. Environment Configuration

Create a .env file in the project root:

```bash
touch .env
```

Add:

```env
SERVER_PORT=6004
DATABASE_URL="postgresql://username:password@localhost:5432/cloudly_drive_app?schema="public"
SESSION_SECRET=your_secret_key
CLOUDINARY_URL=<your_cloudinary_api_url>
```

#### Important:

- Replace `username` and `password` with your PostgreSQL credentials.
- Database should have CRUD operation permission.
- Project is using PostgreSQL
- Use your cloudinary api url

### 5. Database setup

Log into PostgreSQL:

```bash
psql -U your_username
```

Then:

```SQL
CREATE DATABASE cloudly_drive_app;
```

Schema and Database Initialization:

```bash
npx prisma migrate dev
```

### 6. Start the Application

The app is started using the start script defined in package.json.

```bash
npm start
```

Internally, this runs something like:

```json
"start": "node app.js"
```

If no start script exists, run the entry file manually:

```bash
node app.js
```

(Replace app.js with your actual entry file.)

### 7. Access the Application

Open your browser:

```code
http://localhost:3000
```

### Assumptions

- PostgreSQL is running
- The database user has proper permissions
- The .env file is configured correctly

## Acknowledgements

- Icons are downloaded from [Google Material Symbols and Icons](https://fonts.google.com/icons)
- All fonts used are taken form [Google Fonts](https://fonts.google.com/)
- Thanks to [The Odin Project](https://www.theodinproject.com) community to provide an amazing learning resources.

## Contact

- [Email](mailto:lilhareyashu@gmail.com)

## License

All rights reserved under MIT License
