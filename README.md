# Currency Exchange Web App for IBM

## Contents
- Node.js + Express backend that serves static React.js files on production environment
- React.js frontend
- Written in TypeScript
- Dockerfile(s) for both backend and frontend and docker-compose.yaml in the root directory
- The [app](https://currencyxchange-ibm.herokuapp.com/) runs on Heroku. I wasn't able to host the app Dockerized so I created another branch
where I have a build script that builds the FE part, copies it to BE and then pushes the BE part to Heroku
- The app (in production) uses mongodb hosted in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- docker-compose.yaml consists of three containers. One for BE, one for FE and one for MongoDB.
- The database consists of four collections: 
  - currencies: all the available currencies that the user can choose from.
  - fxrates: foreign exchange rates (in relation to the euro).
  - lastfetches: single document collection. Describes when the last resource fetch occurred.
  - users: information on users that did an exchange on the website. Consists of their IP and action.
- The resources from [Lietuvos bankas](https://www.lb.lt/webservices/FxRates/) are re-fetched every night at 4AM
(the dependency responsible for making that happen is node-scheduler)


