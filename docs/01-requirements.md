# System Requirements

Running this website requires the following:

- Node.js 14 LTS
- Yarn package manager
- A MongoDB database
- Docker (for Meilisearch only)

## Setting up a temporary MongoDB database with Docker

This method is aimed at a development environment.

Create a new folder and place `docker-compose.yml` inside it:

```yml
version: '3.8'

services:
  mongodb:
    image: mongo
    container_name: mongodb
    volumes:
      - ./database:/data/db
    ports:
      - 27017:27017
```

Then run `sudo docker-compose up -d` to start the database.  
This database does not start automatically on PC startup and can be stopped
at any time with `sudo docker-compose down`.

A `database` folder is created and used to persist data across reboots.
