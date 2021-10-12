### Data Volumes

---

If we use `Data Volumes` to persist data, we have to define a volume. Then any files or data put in that volume will outlive the container. If we remove the container, it will not remove the data volume, instead we have to take one more step to remove the volume, `docker volume prune`. This extra step is just for an insurance, to ensure the the data volumes are much more important than the container itself.

Let's pull the `mysql` image,

```docker
docker pull mysql
```

Now, inspect the image,

```docker
docker image inspect mysql
```

Inside the `Config.Volumes`, we should see a volumes, `/var/lib/mysql`.

We now run a container from the image,

```docker
docker container run -d --name mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=true mysql
```

We can verify the container is running by,

```docker
docker container ls
```

In the output list, we should see the `mysql` container is running.

We can inspect the container,

```docker
docker container inspect mysql
```

Under `Mounts`, we should see `/var/lib/mysql` as mounted volumes list. When a container is running, the container assume the directory path is `/var/lib/mysql`, but it's actual path is defined in the `Source` property and in my case, the actual path is `/var/lib/docker/volumes/0097b12ff7e460e44174a208e8c52ba40eeb882723696e8057906403c3a17e13/_data`.

We can see the list of mounted volumes,

```docker
docker volume ls
```

This should give all the mounted volumes by the docker containers.

We can get the volume name by the `docker container inspect mysql`. From this command output, under `Mounts`, we can get the mounted volumes name. To inspect our specific volume, we can run inspect command by the name,

```docker
docker volume inspect 0097b12ff7e460e44174a208e8c52ba40eeb882723696e8057906403c3a17e13
```

In output, there is a property `Mountpoint` and from the linux machine, we can directly access that mount point,

```bash
cd /var/lib/docker/volumes/0097b12ff7e460e44174a208e8c52ba40eeb882723696e8057906403c3a17e13/_data
```

This should take us the `_data` directory.

Lets, remove the mysql container,

```docker
docker container rm mysql
```

Now, if we look for the volumes,

```docker
docker volume ls
```

We will notice, even though our container is removed, our data is persisted. This solves our data persistency problem.

Although, from container, we can find the mounted volumes, but from volume perspective, we can not say which container it is connected to.

### Named Volumes (An Enhance of Data Volumes)

---

To make `Data Volumes` more user friendly, we can use `Named Volumes`. To use `Named Volumes` we have to specify the volume config on the `docker run` command with `-v` flag.

We can create a mysql container with `Named Volume` by,

```docker
docker container run -d --name mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=true -v mysql-db:/var/lib/mysql mysql
```

Now we can easily inspect the volume by name,

```docker
docker volume inspect mysql-db
```

This will give the details of the `mysql-db` platform.

It is also possible to create volume ahead of time.
