# globe-access-api

# The idea of this project is to create a RESTful API for managing countries and their immigration policies providing travelers with easy access to information on visa requirements.

## Tech Stack:

-  Backend: Node.js using TypeScript
-  Framework: Koa
-  Database: MongoDB
-  Cache: Redis
-  Connector: mongodb
-  Infrastructure: Docker
-  Testing: Jest

-  Get a list of all countries
-  Get necessary visa information for all countries
-  Get other necessary information for all countries (e.g. currency, language, capital, flag, phone code, etc.)

# Collections:

## country
- id (MongoDB ObjectId)
- countryName (String)
- isoAlpha2Code (String)
- isoAlpha3Code (String)
- isoNumericCode (String)
- capital (String)
- continentCode (String)
- continentName (String)
- phoneCode (String)
- currency (Object)
   - currencyCode (String)
   - currencyName (String)
   - currencySymbol (String)
- language (Object)
   - languageCode (String)
   - languageName (String)
- flag (String) URL
- emoji (String)

## immigration
- id (MongoDB ObjectId)
- sourceCountry (String)
- destinationCountry (String)
- visaStatus (String)


# Required ENV's

-  PORT=3000

-  MONGODB_URI: mongodb://mongo_db:27018/globe-access-api
-  MONGODB_DATABASE_NAME: globe-access-api
-  MONGODB_CONNECT_TIMEOUTMS: 5000


# Run Project using Docker

-  clone the project

# To run project in development mode

-  `npm run docker:dev`
- an initial GET call is required in order to feed the data into the database (this is a one-time call) (postman or curl)
- GET http://localhost:3000/api/v1/cron/feed-values

# To run project in production mode

-  `npm run docker:prod`

-  It will start the server on port 3000 & api is available to consume


   -  Health check: GET - http://localhost:3000/health
   -  Initial Call: GET - http://localhost:3000/api/v1/initial-call
   -  Get required information for immigration policies: GET - http://localhost:3000/api/v1/country


# Request body

-  healthCheck - GET - /api/health
   No body required


-  initialCall - GET - /api/v1/initial-call
   No body required


# Project Structure

-  src/
   -  index.ts - entry point of the application
   -  server/ - has all server related configurations
      -  server.ts - server configurations
   -  routes/ - has all routes
   -  controllers/ - has all controllers
   -  managers/ - has all business logic
   -  services/ - has all services
   -  database/ - has all database adapters
   -  constants/ - has all constants
   -  decorators/ - has all decorators
   -  types/ - has all types/interfaces used through out the project
   -  utils/ - has common functionality used through out the project (messages, enums, error handler etc..)
-  Dockerfile - docker file
-  docker-compose.dev.yml - yml file with all configurations for development
-  docker-compose.prod.yml - yml file with all configurations for production
