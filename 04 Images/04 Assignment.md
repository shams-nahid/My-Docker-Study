## Assignment

In this assignment, objective is create a `Dockerfile` that can run a node app.

- Make sure `Dockerfile` run a node app in local environment
- Push the image to `docker hub`
- Remove local images from local machine cache
- Get the image from `docker-hub` and run the node app again

Create a node app in a directory named, `dockerfile-assignment-1`,

```bash
mkdir dockerfile-assignment-1 # creating a directory for the node app
cd dockerfile-assignment-1 # go to the directory
npm init -y # create a node app
```

Now create a `Hello World` app using `express.js` from [example](https://expressjs.com/en/starter/hello-world.html),

Our `package.json` file should similar,

```json
{
  "name": "dockerfile-assignment-1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "*"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

And the server file will be `index.js`,

```bash
touch index.js
```

Our `index.js` file should be similar to the [example](https://expressjs.com/en/starter/hello-world.html)

```js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
```

Now create a `Dockerfile`,

```bash
touch Dockerfile
```

Our dockerfile should be like,

```docker
FROM node:15.14.0
WORKDIR app
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

Now build a image and run the container from it,

```docker
docker build . -t node-app && docker run -p 80:3000 node-app
```

Now we should see the server response from browser by browsing `http://127.0.0.1/`.

To push the docker image to the `docker hub` it should have a repository name of `user_name/repository_name`.

We can tagged the image to the docker hub format by,

```docker
docker tag node-app bmshamsnahid/node-app
```

We got the exact format to push the image to `docker-hub`. We can verify this by,

```docker
docker image ls
```

We should see the image with repository name `bmshamsnahid/node-app`.

Push the image to docker hub by,

```docker
docker push bmshamsnahid/node-app:latest
```

We again run the node app from the image that is now in the docker hub. To do so, first remove the local image and running container.

Remove images from local machine cache,

```docker
docker image rm -f node-app bmshamsnahid/node-app
```

Stop and remove the container,

```docker
docker container stop <container_id>
```

Now, get the image from `docker-hub` and run a container from it,

```docker
docker container run --rm -p 80:3000 bmshamsnahid/node-app
```

This should run our node app and should be access in `http://127.0.0.1/`
