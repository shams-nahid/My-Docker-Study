## Multi-container Continuous Integration

### Approach

---

We already got our development environment for multiple environment. To implement the development environment, we can do the following steps,

- Push the code to `Github`
- `Travis CI` will pull the code
- `Travis CI` will build the test image, run the tests and remove the test image
- `Travis CI` will build the production image
- `Travis CI` will push the image to `Docker Hub`
- `Travis CI` will notify `Elastic Beanstalk` that the image is being uploaded to `Docker Hub`
- `Elastic Beanstalk` will pull the image from the `Docker Hub`, run the container and serve web request

### Worker Process Production Dockerfile

---

For production, in the worker process, we will use the very similar configuration of development config. The only change will be the start-up command of the container.

First go to the `worker` directory and create a `Dockerfile`,

```bash
cd worker
touch Dockerfile
```

Our production version of `Dockerfile` should look like the followings,

```docker
FROM node:14.14.0-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
```

### Production API Dockerfile

---

For production, like previous `worker` process, our `Dockerfile` will be similar to the `Dockerfile.dev` except the container startup command.

So, go to the `server` directory and create a `Dockerfile`,

```bash
cd server
touch Dockerfile
```

And our `Dockerfile` for `API` should be the following,

```docker
FROM node:14.14.0-alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
```

### Nginx Server Production Dockerfile

---

Sometimes, our docker configuration for both development and production will be same. It's always good practice to use separate files for development and production. For our `Nginx` server, since both development and production docker config file is same, we will just copy the `Dockerfile.dev` to `Dockerfile`.

```bash
cd nginx
cp Dockerfile.dev Dockerfile
```

> Since we have a route for handling socket connection in development phase, which is not required in the production, We might consider a separate config file for nginx server.
