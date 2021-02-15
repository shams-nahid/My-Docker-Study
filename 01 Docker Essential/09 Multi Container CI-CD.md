## Multi Container CI/CD.md

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

### Adding Postgres Service

Now we have docker-file for the client, server and worker process. Now, we are going to put a docker-compose file to make all the application start up more easy.

Each of the application container require different arguments, like the express require a port mapping for port `5000`, react app need a port mapping `3000`. We also need to make sure the worker process has the access to redis server. Also the express server needs access of `redis` server and `postgres` server. Along with these integration, we have to provide all the environment variables to the container.

To do so, we first integrate the express server with the `redis-server` and `postgres-database`. After that, we will connect all other pieces, the `Nginx server`, react app and worker process.

Let's create the `docker-compose.yml` file in the project root directory,

```bash
touch docker-compose.yml
```

Our `docker-compose.yml` file should be,

```yml

```
