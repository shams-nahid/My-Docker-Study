## Multi Container CI/CD.md

Today we are going to make an app that is responsible to generate fibonacci number. But instead of writing a simple method, we will take it to next lavel and put couple of complexity layer to serve our sole purpose, multi container CI/CD.

We will have a react application, that will take the input for a user to get the fibonacci number of a certain index.

This index will pass to the backend server. We will use an express server in the backend. The express server will save the index in `Postgres` and also store the index in the redis server. A worker process will be responsible for generating the fibonacci number. It will generate, put the result in the redis and then finally return the response to the react application.

Too much complexity!! We are taking this complexity just to go through the multi-container CI/CD.

### Application Architecture With Image
---

Architecture image goes here.

### Worker Process Setup

---

