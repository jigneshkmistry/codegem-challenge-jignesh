## CodeGem feedback api

To run this project locally (*docker required*):

1. Clone repo
2. Create `.env` file in the directory root specifying the `POSTGRES_USER` and `POSTGRES_PASSWORD` variables.
3. Start DB: run `npm run docker:dev` or `docker-compose -f docker-compose.dev.yml up -d`
4. run `npm run start:dev`

*Postgres will listen on 5433 (default for Postgres is 5432, we're using 5433 to avoid conflicts) and web server will listen on 3000*

## Environment variables

Environment variables should be provided by creating a `.env` file. You may use `.env.example` as a template.

- `API_HOST`: Host to listen on, defaults to localhost
- `API_PORT`: Port to listen on, defaults to 3000
- `POSTGRES_USER`: Postgres username
  - Note: The username, password and DB is used by Postgres docker image in docker-compose.yaml during startup
- `POSTGRES_PASSWORD`: Postgres password
- `POSTGRES_DB`: Postgres DB name
- `APPROVED_ORIGINS`: JSON-encoded array of origins this API can be accessed from. This adds correct CORS headers if origin is in list.

## Seed script

After running `npm install` in this directory, you can run `npm run seed`.
This script creates dummy data so that the My Diary section can be seen in action.

Without running the seed script, it will be hard to test the streak calculation.

## Unit tests

We use Jest to write and run tests. There's an `example.test.js` file that you can refer.

You can run `npm run test` to run the tests. 

Note: the tests read the `.env` file and need the DB up and running. (Refer to first section on this page on how to start database)
