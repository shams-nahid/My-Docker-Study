### Building Image

---

We can configure the `docker-compose` to build an image runtime and use it. If we configure `docker-compose` to build an image in runtime, it first check if the image already exist in the local machine cache. If the image does found in the local cache, it build one, put it in cache and use.

> With `--build` flag with `docker-compose` cli, we can ensure, the image will be built and will overwrite the cache image.

Here, we build `Nginx` server to serve traffic of `Apache` server.

To build custom `Nginx` image, we will need a `Dockerfile`. Let's create a `Dockerfile` named, `nginx.Dockerfile`,

```bash
touch nginx.Dockerfile
```

We will need a `Nginx` configuration file that will serve the traffic as proxy server for the `Apache` server. Create a configuration file named `nginx.conf`,

```bash
touch nginx.conf
```

Assuming that the `DNS` name for the `Apache` server will be `web`, our `nginx.conf` file should be as follows,

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

Our `nginx.Dockerfile` should be as follows,

```docker
FROM nginx:1.13

COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Now, we need a `docker-compose` file to orchestrate all these two containers. Create a file named `docker-compose.yml`,

```bash
touch docker-compose.yml
```

Our `docker-compose.yml` file should be as follows,

```yml
version: '3.1'
services:
  proxy:
    build:
      context: .
      dockerfile: nginx.Dockerfile
    image: 'proxy'
    ports:
      - '80:80'
  web:
    image: httpd
    volumes:
      - ./html:/user/local/apache2/htdocs/
```

For apache web server we do a `Bind Mount` to server html documents from the host machine.

Let's create a directory `html` and create a file `index.html`,

```bash
mkdir html
cd html
touch index.html
```

Our `index.html` file can be as follows,

```html
Hello World
```

Now, we can run all these containers using docker compose by,

```docker
docker-compose up
```

From browser, if we browse, `http://localhost`, we should see, `Hello World`.

Since we have a `Bind Mount` of the `html` directory, we can change the content from the `index.html` and these changes should be visible in the browser with a refresh.

If we again run `docker-compose up`, this time the `proxy` image will be taken from the local image cache. If we want to build the image instead of use it from the cache, we can run,

```docker
docker-compose up --build
```

To clean up all the containers along with the images, we can use the `--rmi` flag,

```docker
docker-compose down --rmi local
```
