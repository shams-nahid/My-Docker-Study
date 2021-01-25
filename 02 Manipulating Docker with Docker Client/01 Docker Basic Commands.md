## Docker Basic Commands

### Creating and run a container from an image

---

```bash
docker run hello-world
```

Here, `docker` is the `docker-client` name, `run` is create and run the `container` and `hello-world` is the `docker image` name.

With this command we also run the `start-up` script. That `start-up` script is responsible to print the text `Hello from Docker!`.

### Override startup or default command

---

Anytime we execute `docker run` with an image,

- We took the file snapshot to the physical storage
- Execute the startup script

To override the default startup command, we can pass our command as 4th parameter.

```bash
docker run busybox echo hi there
```

We will get the output

```bash
hi there
```

Here, `busybox` is the image and `echo hi there` is our over ride start up command.

We use `busybox` image instead of `hello-world` because `busy box` has the program like `echo`.

### Listing container in local machine

---

Check the currently running container.

```bash
docker ps
```

If there is no docker container is running the list will be empty.

Let's run a container for long time and check it `docker ps` works.

```bash
docker run busybox ping google.com
```

This will run a significant time to measure the latency. In the meantime let's run the listing command

```bash
docker ps
```

Now we should see the `busybox` is running along with it's other properties.

To check all the containers ever been created in the local machine, we can use a flag `all`.

```bash
docker pas --all
```

This will output all the containers we been created in local machine.

### Restart stopped docker container

---

We can restart the docker container in future at any point.

To do so, we need the `container_id`. We can get the `container_id` by following command

```bash
docker ps --all
```

In the first column of the table, contains `container_id`.

Now we can start the stopped docker using the following commands

```bash
docker start -a cee8f8c62478
```

Here `-a` watch out the output of the `container` and print it in the `console`.

### Removing stopped containers

---

We can see all the containers we run before by

```bash
docker ps --all
```

To remove all these containers along with the build file we can use the following

```bash
docker system prune
```

> With `docker system prune`, we have to re-download all the images we downloaded earlier

### Retrieve the logs of a container

---

In some scenario, we might need to see the output of the docker container.

For example,

```bash
# get ready the busybox container that will print `Hi there!`
docker create busybox echo Hi there!
# start the container
docker start container_id
```

Now the docker provide the output `Hi there`, but since we did not use `-a` flag, the output will not be printed in the console.

To see logs, we can use the following commands

```bash
docker logs container_id
```

This will give us the output `Hi there!`.

> `docker logs` does not re-run or restart the docker `container`. It just get the logs emitted from the `container`.

### Stopping a container

---

To stop a docker container we can use the following method

- `Stop` a container by `docker stop container_id`
- `Kill` a container by `docker kill container_id`

When we use the `stop` command a `SIGTERM` signal is passed to the primary process of the container. It gives the process `10 seconds` to close the process and do the post process, like save files, do logging etc. If the primary process does not close within `10 seconds`, it then pass `SIGKILL` signal that kill the process immediately.

The `kill` command pass `SIGKILL` signal that kill the process immediately.

> `SIGTERM` stands for `Terminate Signal`. `SIGKILL` stands for `Kill Signal`.

### Multiple commands in container

---

Let's say we need to tweak the `redis-cli`. In this case, if redis server is installed in my local machine, in one terminal, we can start the `redis server`. In another terminal, we can start the `redis-cli`.

With `docker`, if we install the `redis`, we can start the redis server by the startup command. But in this case, if we go to another terminal window and try to start the `redis-cli`, we can not access it. Because, from a regular machine terminal window, we can not access the redis server that is running in a isolated namespace.

**Example :**

Lets run the `redis` container by

```bash
docker run redis
```

This will install the redis server and start the server also.

Now If we go to another terminal and try to access `redis-cli`, we will get an error.

**Solution :**

To execute the `redis-cli` inside the `container` we need to follow the skeleton,

```bash
docker exec -it container_id redis-cli
```

This will execute the `redis-cli` command inside the container and with `-it` flag, we can pass the command through the terminal and get the emitted output by the container inside our terminal.

In this way we can interact with redis server like

```bash
127.0.0.1:6379> set myVal 5
127.0.0.1:6379> get MyVal
```

> Here the `exec` stands for `Execute`. Without `-it` the `redis-cli` will run inside the `container` but we can not interact using host machine terminal.

> Each process running in the docker or `virtual linux environment` contains `STDIN`, `STDOUT`, `STDERR`. The `STDIN` stands for `Standard In`, `STDOUT` stands for `Standard Output` and `STDERR` stands for `Standard Error`. `-it` is combined of two standalone flag. `-i` stands connect with processes `STDIN` and `-t` ensure formatted text.

### Start a terminal/shell of container context along with docker start

---

May be we do not want to always use the `exec` command to open a terminal for a container every time we want to execute some command inside the container.

To open a terminal inside the container we can use the following command

```bash
docker exec -it container_id sh
```

Now a terminal inside the container will be appeared and we can execute all the `unix` command there. For example we can run the previous `redis-cli` command here and interact with `redis-server`.

> `sh` is program execute inside the container, known as `command processor`. Similar programs are `zsh`, `powershell`, `bash` etc. Traditionally most of the container has `sh` program included.

If we want to run the terminal inside the container on startup, we can use the following

```bash
docker run -it image_name sh
```

This will start the `container` and also start a terminal in the `container` context.

> This `sh` program will prevent other startup command supposed to be run during the `container` start.
