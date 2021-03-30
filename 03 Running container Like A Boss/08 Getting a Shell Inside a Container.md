## Getting a Shell Inside a Container

To interact in the container, we need to get inside the container. We can consider 2 scenarios here,

- Get interactive terminal in container
- Run a program inside a container

### Interactive Terminal on Container Startup 
---

`-it` is a combination of two flag `i` and `t`. They provide an standard input output along with a terminal for a container. To get an interactive terminal for `nginx` server, we can run,

```docker
docker container run -it --name proxy nginx bash
```

We can exit using

```bash
exit
```

We can do detail experiments for `ubuntu` os,

```docker
docker container run -it --name ubuntu ubuntu
```

Now in the interactive terminal, first update the packages and install `curl`

```bash
apt-get update
apt-get install -y curl
```

We can use `curl` from the terminal.

```bash
curl google.com
```

We can exit from the terminal by

```bash
exit
```

If we again want to get the terminal in the running `ubuntu` machine,

```docker
docker container start ubuntu -ai
```

### Run Program Inside Container

---

We can run program inside the container using the `exec` command.

Let's run `mysql` inside a container,

```docker
docker container run -d --name mysql -e MYSQL_RANDOM_ROOT_PASSWORD=true mysql 
```

In the `mysql` container, there is a preinstalled program, called `bash`. We can execute the `bash` and get access to the interactive terminal.

```docker
docker container exec -it mysql bash
```

Let's get image of `alpine` from the `docker-hub`,

```docker
docker pull alpine
```

Since, the `bash` is not installed in the `alpine` and we try to run it inside the container, we will get an error, the program is not avaiable.

```docker
docker container run -it alpine bash
```

In `alpine` there is another program called `sh` with similar functionality. We can run `sh` in the `alpine` by,

```docker
docker container run -it alpine sh
```

> `Alpine` is a minimal featured, security focused linux distribution.