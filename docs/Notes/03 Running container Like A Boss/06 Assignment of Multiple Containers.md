## Assignment of Multiple Containers

We will do the following task:

- No networking between containers are required
- Run `Nginx` server 
  - With detach mode 
  - With a defined name `proxy`
  - At port 80
- Run `mysql` server
  - With detach mode 
  - With a defined name `db`
  - At port 3306
  - Invoke to generate random password and find it from logs
- Run `apache` server
  - With detach mode 
  - With a defined name `web_server`
  - At port 8080

### Nginx

We can run `Nginx` by

```
docker container run -d --name proxy -p 80:80 nginx
```

The server should run in `http://localhost/`

Ref:
1. [image](https://hub.docker.com/_/nginx)
2. [Docker run](https://docs.docker.com/engine/reference/commandline/container_run/)
3. [Docker Detach](https://www.freecodecamp.org/news/docker-detached-mode-explained/)
4. [Assign Name](https://docs.docker.com/engine/reference/commandline/run/#assign-name-and-allocate-pseudo-tty---name--it)
5. [Expose Port](https://docs.docker.com/engine/reference/commandline/run/#publish-or-expose-port--p---expose)

### MySQL

We can run `mySQL` by

```bash
docker run -d --name db -p 3306:3306 -e MYSQL_RANDOM_ROOT_PASSWORD=yes mysql
```

We can look for logs

```bash
docker logs
```

In logs, we should find the root password

```txt
GENERATED ROOT PASSWORD: auto_generated_password
```

Ref:

1. Image from [Docker Hub](https://hub.docker.com/_/mysql)
2. `MYSQL_RANDOM_ROOT_PASSWORD` environment name [Docker Hub](https://hub.docker.com/_/mysql)
3. [Passing environment](https://docs.docker.com/engine/reference/run/#env-environment-variables)

### Apache (httpd)

We can run the apache server by,

```bash
docker container run -d --name web_server -p 8080:80 httpd
```

The server should run in `http://localhost:8080/`.

Ref:

1. [image](https://hub.docker.com/_/httpd)

### Stopping all the containers

We can list down the containers by,

```bash
docker container ls
```

We can stop all these containers,

```bash
docker container stop <nginx-container-id> <mysql-container-id> <nginx-container-id>
```

Now `docker container ls` should return list of containers as stopped status.

### Delete all the images

We can list down the containers by,

```bash
docker container ls
```

We can remove all these containers,

```bash
docker rm -f <nginx-container-id> <mysql-container-id> <nginx-container-id>
```

Now `docker container ls` should return empty list.