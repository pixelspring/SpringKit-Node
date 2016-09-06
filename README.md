![SpringKit-Node Logo](http://i.imgur.com/h1pwJDy.png)

###### A boilerplate for Node/Express/MySQL web applications

## Quick Start:
Install dependencies with: `npm install`

Create a MySQL DB, with the name specified in your `.env` file (see SAMPLE.env)

Run app with the excellent [Nodemon](http://nodemon.io/):`nodemon`

Point your browser at `http://127.0.0.1:3000`

### Component/Package Docs:
* [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) (templating)
* [Nodemailer](http://nodemailer.com/) (email)
* [Moment](http://momentjs.com/) (date formatting)
* [Passport](http://passportjs.org/docs) (authentication)
* [Express](http://expressjs.com/en/4x/api.html)

### Project Structure:
```
.
├── config/                    # Configuration Files
│   ├── passport.js/           # Passport auth strategies
│   ├── bookshelf.js/          # Bookshelf ORM
│   ├── routes.js/             # App Routes
├── controllers/               # Route handlers
├── migrations/                # DB Migrations
├── models/                    # DB models
├── public/                    # All publicly accessible files
│   ├── css/                   # CSS
│   ├── fonts/                 # Web fonts
│   ├── img/                   # Images
│   ├── js/                    # Clientside JavaScript
├── views/                     # View Templates
├── .env                       # API keys, passwords, other sensitive info
|── SAMPLE.env                 # Example .env file
├── server.js                  # Main Express application file
└── package.json               # NPM Dependencies and scripts
```