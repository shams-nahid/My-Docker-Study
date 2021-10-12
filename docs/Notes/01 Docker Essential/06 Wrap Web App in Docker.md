## Wrap Web App in Docker

Let's create a tiny node.js web application and wrap it inside the `docker container`.

Then we should access the app from the browser of the local machine. Right now we will not be worry about deploying the app.

### Create a Node.js app

---

First create a directory, enter into it and run

```bash
npm init -y
```

Install `express.js` package by

```bash
npm i express
```

Now create a file named `index.js` and create a server. `index.js` should be like following

```js
const express = require('express');
const app = express();

// from browser, a get request in `/` route, should return `Hi There!!`
app.get('/', (req, res) => res.send('Hi There!!'));

// app will be run on port `8080`
app.listen(8080);
```

Time to create a `Dockerfile`. Before we create the `Dockerfile`, we need to consider some concept and instructions.

### Selecting A Base Image

---

A `base image` contains is a collection of preinstalled programs. In the [docker hub](https://hub.docker.com), if we look for the `node` image, we should find images with different version along with `alpine` tag. This `node` images has the `node` and `npm` installed.

> `alpine` is being used in the docker world to signify an image as small and compact as possible.

> `docker hub` is a repository of docker images.

We can select a `base image` of `node` with the command.

```bash
FROM node:alpine
```

### Load Application Files

---

After building a container, we can stat the image. As soon as the `container` boots up, `file snapshot` of the `image` is copied to the `namespace` area. And this `file snapshot` is the base image `file snapshot`, does not contains our working directory, like `package.json` or `index.js`. We need to use an `instruction` to take our files to the `container` file systems.

To copy our local files to the `container` file system, we need to use `COPY` instruction. It takes two arguments, first one is the path of local file system path. The second one is the `container` file path.

```bash
COPY ./ ./
```

### Port Mapping

---

When we run a web application in the `container` tha port in the `container` can not be accessed from the `local` machine by default. We need to do a `port mapping` that will define which port from the `local server` direct the traffic to the `container` port.

So while we start the `container` we have to map the `port`.

```bash
docker run -p local_machine_port:container_app_port image_id
```

### Create A Working Directory

By default while we copy the file from the local machine to the `container`, in container the files persist on the `root directory`. We might want to put the project files in the separate directory. We can define our working directory by `WORKDIR` instruction. This `WORKDIR` will create if not exist and use as the project directory when we copy the files from the local file system to the `container`.

---

```bash
WORKDIR /usr/app
```

### Avoid Unnecessary Builds

---

We need to be careful, for each file changes, we should not reinstall the packages. We can copy the `package.json` file before the `package installation`. Then we will copy the all other files.

In this case, for random files changes, the `package installation` will be taken from the cache. Example

```bash
COPY ./package.json ./
RUN npm install
COPY ./ ./
```

### **Final `Docker` File**

With all these consideration, create a `Dockerfile` in the project root directory. our `Dockerfile` should be,

```bash
FROM node:alpine
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["node", "index.js"]
```

Let's build a `image` from this `Dockerfile`,

```bash
docker build -t bmshamsnahid/myapp .
```

After build the image, let run it with the `tag`,

```bash
# Import the base image
FROM node:alpine

# Create a working directory for the app
WORKDIR /usr/app

# Only if we change the `package.json` file, the npm will install all the modules along with the new one
COPY ./package.json ./
RUN npm install

# Copy all the project files to the `container`
COPY ./ ./

# Set the start up command to run the server
CMD ["node", "index.js"]
```

In the web browser `http://localhost:5000/` should print the following

```
Hi There!!
```

Congratulations!!! You just ran a node application in docker container.
