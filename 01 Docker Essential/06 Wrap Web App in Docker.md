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
app.get('/', (req, res) => res.send('Hi There!!'));
app.listen(8080);
```
