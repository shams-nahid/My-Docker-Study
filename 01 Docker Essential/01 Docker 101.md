## Docker 101

### What is Docker?

---

> According to wikipedia `Docker is a set of platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages called containers.` Just like we can manage our application, docker enables us to manage the application infrastructure as well.

### Why Docker?

---

While we try to run an existing code base, we often have to troubleshoot environment issues. This could be dependency issue, module installation problem or environment mis-match.

Docker, in its core is trying to fix these problems. Docker is trying to make it super easy and really straight-forward for anyone to run any code-base or software in any pc, desktop or even server.

In a nutshell

> Docker make it really easy to install and run software without worrying about setup and dependencies.

### Docker Ecosystem

---

Dockers ecosystem contains

- Docker Client
- Docker Server
- Docker Machine
- Docker Image
- Docker Hub
- Docker Compose

**Docker Image :** Single file with all the dependencies and config required to run a program.

**Docker Container :** Instance of the `Docker Image`.

**Docker Hub :** Repository of free public `Docker Images`, can be downloaded to local machine to use.

**Docker Client :**

- Took the command from the user
- Do the pre-processing
- Pass it to the `Docker Server`
- `Docker Server` do the heavy processing

**An Docker Example :**

Assuming you have already installed docker in your system, let's run,

```bash
docker run hello-world
```

- It imply to run an `container` from the image `hello-world`
- This `hello-world` is a tiny little program, whose sole purpose is to print `Hello from Docker!`
- `Docker Server` check the `local image cache`. If it is not exist in the `local image cache` it goes to `Docker Hub` and download the `image`.
- Finally the `Docker Server` run the `image` as `container` or `image instance`.
- If we run the same command again and the `image` is already in the cache, It does not download it from the `Docker Hub`.
