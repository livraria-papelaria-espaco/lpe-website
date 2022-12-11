# Running the website

The `package.json` on the top-level folder has a bunch of useful scripts
for quick development.

Start by installing all the dependencies using

```sh
yarn && yarn setup
```

Then, to start the development servers for both the frontend and the backend, run

```sh
yarn dev
```

By default, the backend is available on http://localhost:3337 and the frontend
on http://localhost:3000.

Meilisearch can be started using `docker-compose` in the `meilisearch` folder:

```sh
sudo docker-compose up -d
```
