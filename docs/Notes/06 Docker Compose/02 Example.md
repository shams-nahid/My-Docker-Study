### Docker Compose Example

Here we will use docker compose to spin up a `Nginx` server and a `Apache` server.

The `Nginx` server will be use as a proxy server to redirect traffic to the `Apache` server.

To do so, first create a `Nginx` server configuration that will be used to redirect the traffic named `nginx.conf`,

The `nginx.conf` file should be,

```nginx
server {
  listen 80;
  location / {
    proxy_pass         http://web;
    proxy_redirect     off;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Host $server_name;
  }
}
```

You might notice, we are passing the traffic of port `80` to `http://web`. Here `web` will be the `DNS` name of the `Apache` server in our `docker-compose.yml` file.

Now, let's create the `docker-compose.yml` file,

```bash
touch docker-compose.yml
```

Our `docker-compose.yml` file should be as follows,

```yml
version: '3'

services:
  proxy:
    image: nginx:1.11
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
  web:
    image: httpd
```

Here, we do port mapping of `Nginx` server from host machine `80` to container `80` port. We are also doing a `Bind Mount` of `nginx.conf`, so this `nginx.conf` will be used in the container instead of the default configuration.

In the services, we named `Nginx` server as `proxy` and `Apache` server as `web`. Here these `proxy` and `web` can be used as `DNS` name for these server.

> `ro` stands for read only and this property is optional

We can run these container by,

```docker
docker-compose up
```

This will spin up all these server and in browser `http://localhost/`, we should see `It works!`

We can stop these containers by `ctrl + c`.

To run containers in background, we can use `-d` flag,

```docker
docker-compose up -d
```

To check the running containers,

```docker
docker-compose ps
```

This should show `Nginx` and `Apache` server is running.

With nice formatted output we can see all the services by,

```docker
docker-compose top
```

To clean up (stopped and removed) all the containers,

```docker
docker-compose down
```
