# Using Container Like A Boss

Containers are the fundamental building blocks of `Docker` tool-kit. Before we get stared, we have to make sure the latest version of `Docker` is installed in the system. It is important to keep in mind, `Docker` is different from the `VM`.

In this article, we are going to discuss, how `Docker` is different from `VM`, play with `Nginx` server container and look into basic networking of `Docker`.

Before we dive, let's check the `Docker Version` in our system.

```bash
docker version
```

With this command, we should get an output, something like this,

```
Client: Docker Engine - Community
 Version:           20.10.5
 API version:       1.41
 Go version:        go1.13.15
 Git commit:        55c4c88
 Built:             Tue Mar  2 20:18:20 2021
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.5
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.13.15
  Git commit:       363e9a8
  Built:            Tue Mar  2 20:16:15 2021
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.4.4
  GitCommit:        05f951a3781f4f2c1911b05e61c160e9c30eaa8e
 runc:
  Version:          1.0.0-rc93
  GitCommit:        12644e614e25b05da6fd08a38ffa0cfe1903fdec
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

If you get the `Docker` server information, that means we can talk to the server. Otherwise, there is something wrong with the `Docker` installation, like not installed properly, having permission error etc. 

Since, we are going to a lot of new features, ideally you should get the latest version as possible.

Additionally, to get more information about the installed `Docker` server, we can run,

```bash
docker info
```

## Commands and Management Commands

If we want to look all the available commands for `Docker`, we can run,

```bash
docker
```

From this output, we can notice two sections

1. Management Commands
2. Commands

Previously, all the `Docker` commands was available like `docker command`. Since the number of commands increase, the `Docker` team decided to separate them in `sum-commands` aka `Management Commands`. With `Management Commands`, we run commands like `docker <command> <sub-command>`.

**Old Way:** `docker <command> (options)`

**New Way:** `docker <command> <sub-command> (options)`

All the old commands are working fine with latest `Docker`. But `Docker` is pushing forward to use the new model `Management Command`.

### Image Vs Container

An image is an application we want to run. On the other hand, a `Container` is an instance of the `image`. Essentially, we can have multiple container running of the same image.