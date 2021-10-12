## CLI Process Monitoring

Using `docker-cli`, for containers, we will test the followings, 

- Running processes of a container
- Container metadata
- Performance stats of running container


Before we start, let's start two container, `nginx` and `mysql`,

```bash
docker container run -d --name nginx nginx
docker container run -d --name mysql -e MYSQL_RANDOM_ROOT_PASSWORD=true mysql 
```

### Running Processes
---

To check the running process of a container we can use the `top` command. [top](https://docs.docker.com/engine/reference/commandline/top/) display running processes of a container.

```bash
docker container top mysql
```

This will show the running process of `mysql` container.

### Inspect Container Metadata
---

[inspect](https://docs.docker.com/engine/reference/commandline/inspect/) returns low level information and metadata of docker container, like

- startup config
- volume mapping
- networking

```bash
docker container inspect mysql
```

### Monitoring running container stats
---

We can use `stats` to stream the running container stats, like `CPU` usage, `memory` usage etc.

```bash
docker container stats
```