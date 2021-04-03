// import required modules
const express = require("express");
const redis = require("redis");

const app = express(); // create app instance
const client = redis.createClient({
  host: "redis-server", // service name of the `redis-server` we are using, will be defined in the `services` section of `docker-compose.yml` file
  port: 6379, // default port of the `redis-server`
}); // connect the node server with redis server
client.set("counts", 0); // initially set number of visits to 0

app.get("/", (req, res) => {
  client.get("counts", (err, counts) => {
    res.send(`Number of counts: ${counts}`); // in browser, showing the client, number of visits
    client.set("counts", parseInt(counts) + 1); // increase the number visits
  });
});

const PORT = 8081; // determine node server port no

// run the server
app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
