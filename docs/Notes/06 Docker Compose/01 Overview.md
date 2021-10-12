### Overview

---

Docker container is a single solution process. In real world, we have to deal with multiple containers like, web server, proxy server, worker process, frontend, database server etc. We have to virtual networking, expose public ports and overall orchestrate each pieces. And this is exactly what `docker-compose` does for us.

With `docker-compose` we can orchestrate the services and spin them up in the local and test environment.

Docker compose consists of two separate but related things,

- Docker compose `YML` file, we used to define containers, networking and volumes.
- `docker-compose` CLI, a cli-tool used in the local dev or test environment to automate these YAML file to simplify our docker commands.

### docker-compose.yml

- `docker-compose.yml` file solely responsible for automation in local dev or test environment. Although now it is possible to use docker compose as docker commands (Ex, v1.13 or latest can be used in `Swarm`).
- Default name for docker compose file is `docker-compose.yml`. We can use custom names and use it with `-f` flag.
- In `yml` file we can use indentation of 2 or 4 spaces

**version :** Each yml file has own version. If we do not specify the version, it is assumed the `docker-compose.yml` file is under `v1`. It is recommended to use at least `v2`.

**services :** Containers, same as `docker run` command.

**servicename :** A user friendly name of the container. Also used as `DNS` name under the virtual network.

**image :** Specify a image the container will build from. Can be `redis`, `mysql` etc.

**command :** Override the container start up command.

**environment :** Pass the container environment variables. For example, when we run a database container, we may pass the password through this environment.

**volumes :** Do the volume mapping like `Named Volume` or `Bind Mounting`.

A sample `docker-compose.yml` file can be as follows,

```yml
version: '3.1'

services:
  servicename:
    image:
    command:
    environment:
    volumes:
  servicename:

volumes:
network:
```
