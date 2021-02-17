## Multi-container development environment

Today we are going to make an app that is responsible to generate fibonacci number. But instead of writing a simple method, we will take it to next lavel and put couple of complexity layer to serve our sole purpose, multi container CI/CD.

We will have a react application, that will take the input for a user to get the fibonacci number of a certain index.

This index will pass to the backend server. We will use an express server in the backend. The express server will save the index in `Postgres` and also store the index in the redis server. A worker process will be responsible for generating the fibonacci number. It will generate, put the result in the redis and then finally return the response to the react application.

Too much complexity!! We are taking this complexity just to go through the multi-container CI/CD.

### Application Architecture With Image

---

Architecture image goes here.

### Boilerplate Code

---

A boilerplate code is being found in the `resource directory`.

**description of boilerplate goes here**

To make the development process smoother, we will make development version of each docker container. This will help us not to rebuild the image every time we make chages in development phase.

For each of the projects, we will set up pretty similar docker file workflow. For each of the project we will go through,

- Copy the `package.json` to the container
- Run `npm install`
- Copy everything else
- Volume mapping for hot-reload feature

### Docker Dev For React App

---

First go to the `client` directory and create a `Dockerfile.dev`,

```bash
cd client
touch Dockerfile.dev
```

And our `Dockerfile.dev` should be,

```docker
FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
```

Let's build an image out of this `Dockerfile`,

```bash
docker build -f Dockerfile.dev .
```

This should build an image and give us a `image_id`.

Now we can run the react app using the image id,

```bash
docker run -it image_id
```

This should start the development server of our react app. Since we have not port mapping yet, we can not access the site.

### Docker Dev For Express Server

---

Go to the `server` directory and create a file named `Dockerfile.dev`,

```bash
cd server
touch Dockerfile.dev
```

Our `Dockerfile.dev` file should be like following,

```docker
FROM node:14.14.0-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

Let's build an image out of this `Dockerfile`,

```bash
docker build -f Dockerfile.dev .
```

This should build an image and give us a `image_id`.

Now we can run the react app using the image id,

```bash
docker run -it image_id
```

This should start the express server on port `5000`.

### Docker Dev For Worker

Go to the `worker` directory and create a `docker-file` named `Dockerfile.dev`,

```bash
cd worker
touch Dockerfile.dev
```

Our `Dockerfile.dev` should be like the following, same as the express server `Dockerfile.dev`,

```docker
FROM node:14.14.0-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

Let's build an image out of this `Dockerfile`,

```bash
docker build -f Dockerfile.dev .
```

This should build an image and give us a `image_id`.

Now we can run the react app using the image id,

```bash
docker run -it image_id
```

This should make the worker process standby, so it can listen whenever we insert a message in the redis server.

### Adding `Postgres`, `Server`, `Worker` and `Client` Service

---

Now we have docker-file for the client, server and worker process. Now, we are going to put a docker-compose file to make all the application start up more easy.

Each of the application container require different arguments, like the express require a port mapping for port `5000`, react app need a port mapping `3000`. We also need to make sure the worker process has the access to redis server. Also the express server needs access of `redis` server and `postgres` server. Along with these integration, we have to provide all the environment variables to the container.

To do so, we first integrate the express server with the `redis-server` and `postgres-database`. After that, we will connect all other pieces, the `Nginx server`, react app and worker process.

Let's create the `docker-compose.yml` file in the project root directory,

```bash
touch docker-compose.yml
```

Our `docker-compose.yml` file should be,

```yml
version: "3"
services:
  postgres:
    image: "postgres:latest"
    environment:
      - POSTGRES_PASSWORD=postgres_password
  redis:
    image: "redis:latest"
  api:
    build:
      dockerfile: Dockerfile.dev
      context: ./server
    volumes:
      - /app/node_modules
      - ./server:/app
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - PGUSER=postgres
      - PGHOST=postgres
      - PGDATABASE=postgres
      - PGPASSWORD=postgres_password
      - PGPORT=5432
  client:
    stdin_open: true
    build:
      dockerfile: Dockerfile.dev
      context: ./client
    volumes:
      - /app/node_modules
      - ./client:/app
  worker:
    build:
      dockerfile: Dockerfile.dev
      context: ./worker
    volumes:
      - /app/node_modules
      - ./worker:/app
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
```

We cn build and run the container from our root directory by,

```bash
docker compose up --build
```

### `Nginx` Configuration

---

From browser, we will make request for static resources and seek `API`. For react application, we will make the call similar like, `/main.js`, `/index.html`. But for server api, we will make call on endpoints like `/api/values/all`, `/api/values/current` etc. You might notice our express server does not have `/api` as prefix. It has endpoints like `/values/all`, `/values/current`.

Our `Nginx` server will handle and do the separation. For api endpoints, start with `/api` it will remove the `/api` part and redirect to the express server. Other request will be send to the `react` application.

Whenever we create a `Nginx` server, it will use a configuration file named `default.conf`. Here in this `default.conf` file, we have to put couple of following information,

- Notify `Nginx` that, we have a upstream server at `client:3000`
- Notify `Nginx` that, we have a upstream server at `server:5000`
- Both `client:3000` and `server:3000` should listen to port `80`
- Add a condition to pass all the `/` request to `client:3000`
- Add another condition to pass all the `/api` request to `server:5000`

Here `client:3000` and `server:5000`, comes from the service name we are using in the `docker-compose` file.

Lets create a directory named `nginx` inside the root project and create a file `default.conf` inside the directory.

```bash
mkdir nginx
cd nginx
touch default.conf
```

Our `default.conf` file should be,

```nginx
upstream client {
  server client:3000;
}

upstream api {
  server api:5000;
}

server {
  listen 80;

  location / {
    proxy_pass http://client;
  }

  location /api {
    rewrite /api/(.*) /$1 break;
    proxy_pass http://api;
  }
}
```

> In Nginx config `rewrite /api/(.*) /$1 break;` means, replace `/api` with `$1` and `$1` stands for the matching part `(.*)` of the url. `break` keyword stands for stopping any other rewriting rules after applying the current one.

### `Nginx` Container

---

We set up the `nginx` configuration. Time to set up a docker file for the `nginx server`.

Go to the `nginx` directory and create a file named `Dockerfile.dev`,

```bash
cd nginx
touch Dockerfile.dev
```

Our `Dockerfile.dev` should look like the following,

```yml
FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
```

Thats pretty much it. Last thing we need to do, is add the `nginx` service in our `docker-compose.yml` file.

We need to add the following `nginx` service to our `docker-compose` file,

```yml
nginx:
  restart: always
  build:
    dockerfile: Dockerfile.dev
    context: ./nginx
  ports:
    - "3050:80"
```

Since our `nginx` server is do all the routing, no matter what, we want our `nginx` server up and running. So, we put `restart` property `always`. In this case, we also do the port mapping from local machine to the container.

With adding the `nginx` service to our existing `docker-compose`, our `docker-compose.yml` file should be,

```yml
version: "3"
services:
  postgres:
    image: "postgres:latest"
    environment:
      - POSTGRES_PASSWORD=postgres_password
  redis:
    image: "redis:latest"
  nginx:
    restart: always
    build:
      dockerfile: Dockerfile.dev
      context: ./nginx
    ports:
      - "3050:80"
  api:
    build:
      dockerfile: Dockerfile.dev
      context: ./server
    volumes:
      - /app/node_modules
      - ./server:/app
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - PGUSER=postgres
      - PGHOST=postgres
      - PGDATABASE=postgres
      - PGPASSWORD=postgres_password
      - PGPORT=5432
  client:
    stdin_open: true
    build:
      dockerfile: Dockerfile.dev
      context: ./client
    volumes:
      - /app/node_modules
      - ./client:/app
  worker:
    build:
      dockerfile: Dockerfile.dev
      context: ./worker
    volumes:
      - /app/node_modules
      - ./worker:/app
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
```

Now time to start all the containers by,

```bash
docker-compose up --build
```

Most probably, first time, the server and worker both try to get the redis instance, even it might not being copied. So In case of any error, we just have do run the container one more time by,

```bash
docker-compose up
```

Now, from the local machine browser, if we go to `http://localhost:3050/`, we should see the react app and calculation should work with manual refresh.

### Enable Websocket Connection

The react application keep an connection with it's development server to maintain hot reload. Every time there is a source code changes, react app listen these changes via websocket connection and reload the web app.

We need to configure the `nginx` server to enable the websocket to handle the issue.

To add websocket connection we need a route in the `default.config` file,

```nginx
location /sockjs-node {
    proxy_pass http://client;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
```

So our final configuration for the `nginx` server will be,

```nginx
upstream client {
  server client:3000;
}

upstream api {
  server api:5000;
}

server {
  listen 80;

  location / {
    proxy_pass http://client;
  }

  location /sockjs-node {
    proxy_pass http://client;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }

  location /api {
    rewrite /api/(.*) /$1 break;
    proxy_pass http://api;
  }
}
```

Now, we can test all the container by running,

```bash
docker-compose up --build
```

Our app should be running on `http://localhost:3050/`. Seems like our app is running smoothly on the development machine as expected.
