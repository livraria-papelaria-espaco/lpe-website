# Configuration

The backend, frontend and meilisearch can all be configured through environment
variables.
For development, the easiest way is to create a `.env` file under each directory,
with the following format:

```env
ENV_VARIABLE_NAME1=value1
ENV_VARIABLE_NAME2=value2
```

## Backend

The following environment variables are available:

| Name                | Default Value                          | Description                                                                                          |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `ADMIN_JWT_SECRET`  | _none_                                 | **REQUIRED**. The JWT secret for the admin panel authentication                                      |
| `JWT_SECRET`        | `357b676e-c5f4-44a1-8446-348e0ff0b25d` | **RECOMMENDED**. The JWT secret for site authentication. If not changed, poses a high security risk. |
| `HOST`              | `0.0.0.0`                              | Where the app will listen                                                                            |
| `PORT`              | `3337`                                 | Port where the app will listen                                                                       |
| `EUPAGO_TOKEN`      | `demo-f9ee-b006-8de5-8e8`              | Token for the EuPago payment provider                                                                |
| `FRONTEND_URL`      | `http://localhost:3000`                | URL of the frontend. Used for links in emails                                                        |
| `PREVIEW_SECRET`    | _none_                                 | Must be the same as `PREVIEW_SECRET` on frontend. Used to enable CMS preview mode for a user         |
| `DATABASE_HOST`     | `127.0.0.1`                            | Host of the MongoDB database                                                                         |
| `DATABASE_PORT`     | `27017`                                | Port of the MongoDB database                                                                         |
| `DATABASE_NAME`     | `backend`                              | Name of the MongoDB database                                                                         |
| `DATABASE_USERNAME` | _none_                                 | Username for the MongoDB database                                                                    |
| `DATABASE_PASSWORD` | _none_                                 | Password for the MongoDB database                                                                    |
| `DATABASE_AUTH`     | _none_                                 | Authentication database for the MongoDB database                                                     |
| `DATABASE_SSL`      | _none_                                 | (boolean) whether or not to force SSL for connecting with the MongoDB database                       |
| `SMTP_HOST`         | `localhost`                            | Host of the SMTP mail server                                                                         |
| `SMTP_PORT`         | `25`                                   | Port of the SMTP mail server                                                                         |
| `SMTP_USERNAME`     | _none_                                 | Username for the SMTP mail server                                                                    |
| `SMTP_PASSWORD`     | _none_                                 | Password for the SMTP mail server                                                                    |
| `MEILI_HOST`        | `http://127.0.0.1:7700`                | URL of the Meilisearch instance                                                                      |
| `MEILI_API_KEY`     | _none_                                 | The API key to interact with Meilisearch                                                             |

JWT secrets should be random strings, ideally more than 64 chars in length.

## Frontend

The following environment variables are available:

| Name             | Default Value           | Description                                                                                 |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `API_URL`        | `http://localhost:3337` | The URL of the backend. Used for server side rendering                                      |
| `TAWKTO_ID`      | _none_                  | The property ID for tawk.to live chat                                                       |
| `PREVIEW_SECRET` | _none_                  | Must be the same as `PREVIEW_SECRET` on backend. Used to enable CMS preview mode for a user |

## Meilisearch

The env file should be `meili.env` and **NOT** `.env`.
There is a `meili.sample.env` with sensible defaults.

The following environment variables are available:

| Name                 | Default Value | Description                                  |
| -------------------- | ------------- | -------------------------------------------- |
| `MEILI_ENV`          | `production`  | Set to `development` to enable the web UI    |
| `MEILI_MASTER_KEY`   | _none_        | The master key for this Meilisearch instance |
| `MEILI_NO_ANALYTICS` | `true`        | Whether to disable telemetry                 |
