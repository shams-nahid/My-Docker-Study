## Assignments

- Check the `curl` version from two container, created from
  - Cent OS 7
  - Ubuntu 14.04
- Remove all these containers

### Cent OS

Create container from Cent OS 7. `Cent OS` with version 7 can be found [docker hub](https://hub.docker.com/_/centos?tab=tags&page=1&ordering=last_updated).

```docker
docker container run -it centos:7 bash
```

We can check curl version from bash by

```bash
curl --version
```

This return the `curl` version of `7.29.0`

### Ubuntu

Create container from ubuntu 14.04. The ubuntu image of version 14.04 can be found in [docker-hub](https://hub.docker.com/layers/ubuntu/library/ubuntu/14.04/images/sha256-a664cf8519ac301fb0ef545c3b3e53dfdffcf9a0235ddaa51eca299948cc568f?context=explore)

```docker
docker container run -it ubuntu:14.04 bash
```

By default, the `curl` is not installed. To install `curl`, first update the `packages` by,

```bash
apt-get update
```

Now, install the `curl` by,

```bash
apt-get install -y curl
```

Since the `curl` is installed, check the version,

```bash
curl --version
```

We should get version of `curl` as `7.35.0`.

### Remove Containers

To remove containers, we can use 

```docker
docker rm -f <cent_os_7_container_id> <ubuntu_14_04_container_id>
```

Apparently, If we used `--rm` flag while starting the container, we do not have to remove these container manually.
