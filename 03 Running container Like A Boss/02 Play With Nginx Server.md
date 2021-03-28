# Play With Nginx Server

### Run a Container

To play around the `Docker Container`, we will use `Nginx Server Image`. We will pull it from the `Docker Registry` aka `Docker Hub` and run in our local machine.

Go to terminal and run 

```bash
docker container run --publish 80:80 nginx
```

In browser, if we go to `http://localhost/`, we should see the `Nginx` server is up and running.

With this command `docker container run --publish 80:80 nginx`, 

-  The `Docker` engine looks for the `image` for the `Nginx` web server and if not found, pull it from the docker hub
- Run the `Nginx` web server
- Expose our local machine port `80` and server all the traffic to the `80` port of the `Nginx` server

To stop the container, we can simply try `Ctrl + c`.

We can run the container in background, by using `detach` flag.

```bash
docker container run --publish 80:80 --detach nginx
```

This will run the `Docker` container in background.

We can look all the containers list by

```bash
docker container ls
```

We can stop the container by 

```bash
docker container stop <container-id>
```

Now, if we look the container list by `docker container ls`, the list should be empty.

To observe all the stopped and running containers we can do,

```bash
docker container ls -a
```

In the last column of the list, we see random name of the `Container`. We can define the name while creating and running a container by,

```bash
docker container run --publish 80:80 --detach --name <container-name> nginx
```

Now, if we print the list of running container by `docker container ls`, we will notice the new container with our defined name.

We might want to look for the logs of the `Docker` container, by

```bash
docker container logs <container-name>
```

There are couple of options, while looking for logs,

We can remove docker containers by,

```bash
docker container rm <container-id-1> <container-id-2>
```

This will only remove the stopped container. To stop running containers, we can first stop the running container and then then remove. Also, we can use `force` flag to remove the running container by,

```bash
docker container rm -f <container-id>
```

This will remove the running container.

With `Docker`, in a matter a of time, we are able to run a `Nginx` server with default configuration. We are also able to look the logs and eventually stop the container.