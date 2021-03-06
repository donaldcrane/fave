# fave

[![Node.js CI](https://github.com/donaldcrane/fave/actions/workflows/.node.js.yml/badge.svg)](https://github.com/donaldcrane/fave/actions/workflows/.node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/donaldcrane/fave/badge.png?branch=main)](https://coveralls.io/github/donaldcrane/fave?branch=main)

Fave is a RESTful API service inventory management app

# Documentation

A detailed documentation of the api can be found here: [API Documentation](https://documenter.getpostman.com/view/11971882/UzJLQGqL)
**Run Project Locally**

- Clone the project
- cd into the project's folder and run npm install to install dependencies
- Create a .env file and add PORT value, JWT_KEY, COOKIE_KEY, MONGO_URL for development and TEST_MONGO_URL for testing

- Run npm run seed to seed data into the database
- Run npm run dev to start the server

# HTTP Requests

All API requests are made by sending a secure HTTPS request using one of the following methods:

- POST Create a resource
- GET Get a resource or list of resources
- PATCH updates a resource or list of resources
- DELETE deletes a resource or list of resources
- For POST, the body of your request must be a JSON payload.

# HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- 200 OK Successful request
- 400 Bad Request There was a problem with the request
- 500 Server Error Server error
