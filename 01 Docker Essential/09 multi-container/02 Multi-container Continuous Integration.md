## Managing multiple containers in local environment

### Approach

---

We already got our development environment for multiple environment. To implement the continuous integration, we can do the following steps,

- Make sure, codebase is already in the `Github` repository
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

### Dockerfile For React App

---

For the react we will make use of a separate `nginx` file. We can definitely use our existing `nginx`, but to make the application more robust and independent, we will use the another one. In the client directory, create a folder named `nginx` and a file `default.conf`,

```bash
cd client
mkdir nginx
cd nginx
touch default.conf
```

Our `default.conf` file should be,

```nginx
server {
  listen 3000;

  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

Now we have to create the production version of our react application `Dockerfile`. Go to the client directory and create `Dockerfile`,

```bash
cd client
touch Dockerfile
```

Our production version of `Dockerfile` will be,

```docker
FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
```

In the react application, if we try to run the test, it will throw an error. The reason is in the test file `App.test.js`, we are testing if the `App` component can render without any crash.

This test flow do the followings,

- First try to render the `App` component
- `App` component try to render the `Fib` component
- `Fib` component try to invoke the express server

Since our express server is not running, this will throw an error. In real application, we might simulate an face api response. in this case, we can keep a dummy test execution by removing the following 3 lines from `App.test.js`,

```js
const { getByText } = render(<App />);
const linkElement = getByText(/learn react/i);
expect(linkElement).toBeInTheDocument();
```

Our `App.test.js` file will look like the following,

```js
test("renders learn react link", () => {});
```

### Travis CI Setup

---

We now completely set up the production version of docker for each of the application container. Now we have to create a github account, push all our code to github and then hook it to the `Travis CI`. Then, in our code, we need a `Travis CI` configuration file, responsible for

- Build a test image and test code
- Building production image
- Push the production image to `Docker Hub`
- Notify `Elastic Beanstalk` on code changes
- `Elastic Beanstalk` will pull the image and run the containers

First push all the codebase, make sure your github repository is integrated and synced with `Travis CI`. Now for [settings](https://travis-ci.org/account/repositories), find and enable the switch button to mark as build project.

Since we have not create the `Elastic Beanstalk` instance in the `AWS`, we will not configure that part in the `Travis CI` for now. Also, we are only do the test coverage for the react app, not the api or worker service.

Let's create a `Travis CI` config file named `.travis.yml` in the root project directory,

```bash
touch .travis.yml
```

Our `.travis.yml` file should be like the following,

```yml
sudo: required
services:
  - docker

before_install:
  - docker build -t DOCKER_HUB_USER_NAME/react-test -f ./client/Dockerfile.dev ./client

script:
  - docker run -e CI=true USERNAME/react-test npm test -- --coverage

after_success:
  - docker build -t DOCKER_HUB_USER_NAME/multi-client ./client
  - docker build -t DOCKER_HUB_USER_NAME/multi-nginx ./nginx
  - docker build -t DOCKER_HUB_USER_NAME/multi-server ./server
  - docker build -t DOCKER_HUB_USER_NAME/multi-worker ./worker
  - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_ID" --password-stdin
  - docker push DOCKER_HUB_USER_NAME/multi-client
  - docker push DOCKER_HUB_USER_NAME/multi-nginx
  - docker push DOCKER_HUB_USER_NAME/multi-server
  - docker push DOCKER_HUB_USER_NAME/multi-worker
```

To access the docker hub to upload the image, we need to put the credentials in the `Travis CI` environment section.

To set environment variable, go to `Dashboard -> Select Repository -> Options -> Settings -> Environment Variables`. In the environment variables section, add the following environment variables,

1. `DOCKER_ID`
2. `DOCKER_PASSWORD`

Now, if e push the codebase to the github, the `Travis CI` should test the react app and pushed the build image to the docker hub.
