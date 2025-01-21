# About

This projects creates RESTful API that acts as mediator in an openhim transaction. It is built using Node.js, Express.js and TypeScript.

## Development

### run the project in development mode

`yarn dev` will start the application in development mode.
`yarn dev:hot` will start the application in dev mode with hot reloading.

### linting

`yarn lint` will check for linting errors.

## Production

### build the project with tsc.

`yarn build`

### Run the production build.

`yarn start` (must be run after building the project)

## Using Docker

`docker-compose up -d --build`

This should bring up the application.
By default, the application will be exposed on port 8080

Visiting <http://YOUR-IP-HERE:8080> should display the Swagger UI Docs for the application.
