## Using Docker Compose: Managing Multiple Local Containers

### Docker Compose

---

`docker-compose` helps us to avoid repetitive commands, that we might have to write with `docker-cli` during a `container` start up.

For example, if we have two `container` and need a networking between them, we have to configure these with `docker-cli` every time we start the `container`.

Using `docker-compose` we can resolve the issue.

> This `docker-compose` allows us to start up multiple container at the same time in a very easy and straightforward way. Also it will set up some sort of networking between them and all behind the scene.

To make use of `docker-compose`, we essentially going to the `docker-cli` startup commands of long form and encode these command in `docker-compose.yml` file. We do not entirely copy and paste the start-up commands, instead we use special syntax more or less similar to the start up commands.

After creating the `docker-compose.yml` file, we will feed the file to the `docker-compose-cli` to parse the file and create container with our desired configurations.

### A Hands On

---

Let's develop a classic docker example.

Here we will create a little docker container that will host a web application. This web application will count the number of visit to that web app.

We will need a node app that will response on the `HTTP` request and a `redis` server that will count the number of visit. Although `redis` is a in memory server, in this case we will consider itself as our tiny database.

Off course we can use the node server to store the number of visits. To make the container a little bit complex we are using both a `node` server and a `redis` server.

We can consider a single container with both `node server` and `redis server` in it. But this will create problem on scalability.

For more traffic, if we increase the number of containers, for each container, there will be individual `node server` and `redis server`. Also each `redis server` will be isolated from each others. So one `redis server` will give us total visit of `10`, another `redis server` will give us total visit of `5`.

So our actual approach will be both `node server` and `redis server` will be in isolated container. An in case of scaling we will scale the `node-server-container` and all the `node-server-container` will be connected to the single `redis-server-container`.

### Creating The Node Server

---

Create a project directory named `visits`,

```bash
mkdir visits
```

Now go to the directory and create a node project

```bash
cd visits
yarn init -y
```

Create a file `index.js`

```bash
touch index.js
```

The `index.js` will be responsible for creating the `node server` and connect with the `redis server` to display the `number of site visits` in the browser on response of a `HTTP` request.

The code of the `index.js` will be like followings,

```js
// import required modules
const express = require('express');
const redis = require('redis');

const app = express(); // create app instance
const client = redis.createClient(); // connect the node server with redis server
client.set('visits', 0); // initially set number of visits to 0

app.get('/', (req, res) => {
  client.get('visits', (err, visits) => {
    res.send(`Number of visits: ${visits}`); // in browser, showing the client, number of visits
    client.set('visits', parseInt(visits) + 1); // increase the number visits
  });
});

const PORT = 8081; // determine node server port no

// run the server
app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
```

Except the redis connection on line

```js
const client = redis.createClient();
```

Here we will have to put necessary networking config of the redis server.

### Assembling `Dockerfile` to Node Server

---

Our `Dockerfile` will be very simple to just run the node server

```bash
# define base image
FROM node:alpine

# define working directory inside the container
WORKDIR /app

# Copy the package.json file to the project directory
COPY package.json .
# install all the dependencies
RUN npm install

# Copy all the source code from host machine to the container project directory
COPY . .

# define the start up command of the container to run the server
CMD ["node", "index.js"]
```

Now let's build the image,

```bash
docker build -t docker_user_id/repo_name:latest .
```

This will create the `image` of our `node-server` named `docker_user_id/repo_name`.

Now if we try to run the `node-server` (Although it will throw error, because `redis` server is not running yet),

```bash
docker run docker_user_id/repo_name
```

Here, we will get an error message,

```bash
ode:events:356
      throw er; // Unhandled 'error' event
      ^

Error: connect ECONNREFUSED 127.0.0.1:6379
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1139:16)
Emitted 'error' event on RedisClient instance at:
    at RedisClient.on_error (/app/node_modules/redis/index.js:406:14)
    at Socket.<anonymous> (/app/node_modules/redis/index.js:279:14)
    at Socket.emit (node:events:379:20)
    at emitErrorNT (node:internal/streams/destroy:188:8)
    at emitErrorCloseNT (node:internal/streams/destroy:153:3)
    at processTicksAndRejections (node:internal/process/task_queues:81:21) {
  errno: -111,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 6379
}
```

In summary, it says, the `node-server` can not connect to the `redis-server`, as expected. We will fix it now.

### `Redis` Server

We can use vanilla `redis` image from `docker-hub`. We will simply run the `redis-server` by

```bash
docker run redis
```

Even with running the `redis-server`, if we run the `node-server` again, we will get the same error as before.

Since both `node-server` and `redis-server` is in isolated container and there is no networking communication between them, the `node-server` will not be able to communicate with the `redis-server`.

### Bring The `Docker Compose`

---
