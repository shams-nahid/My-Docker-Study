# With Container Run

When we run the container using `docker container run --publish 80:80 --name <container-name> nginx`, it actually interpret by `docker container run --publish 80:80 --name <container-name> -d nginx:latest nginx -T`.

This command do the following steps:

- Look for `Nginx` image in local cache, if not found get it from `Docker` registry.
  - If we specify the image version, it will be downloaded
  - If we do not specify the image, it will download the latest version
- Create a container out of the image
- Give a virtual IP on a private network inside the `Docker Engine`
- Open port `80` in host machine and forward all traffic of `80` to docker container port `80`
- Start executing container start up command

So while run the container using the specified command, we can change the port mapping and also the image version.