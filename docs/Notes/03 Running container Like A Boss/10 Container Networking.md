## Container Networking

While we start a container with `-p` flag, it exposes a port from the host machine to the docker container. In background, a lot more is going on, we will discuss here.

This `networking` staff is plugable. Under the hood, We can add a container to a container, remover form a network.

When we start a container, we are particularly behind a docker network, called `bridge-network`. This `bridge-network` routes through `NAT Firewall` of the host IP. It is configured by the `docker-daemon` on our behalf. So the container can go back and forth of the outside internet and other network.

But whenever we need to build a communication between specific containers we do not need any port mapping using `-p`.

If we have a network with a `node` application container and a `mongoDB` container, and they need to connect each other, we do not have to do the port mapping or open the port to the rest of the physical network.

And if we have another network with `php` server container and `mysql` database container, they can communicate each other but can not communicate with `node` and `mongoDB` servers network.

With this setup, if the `php server` have to connect with the `node server`, it has to go through the host machine network.

All these configurations are configurable, can be add, removed or changed.

> We can not have two container listening at the same port at the host level

**Figure**

### Networking CLI Hands On

Here we will create two docker network with containers in it. Then play around of adding, removing containers of these networks.

**Objective**

We will create two container, `ix_nginx_1` and `ix_nginx_2`. The `ix_nginx_1` should connect to a custom network `ix_network`. On the other hand, the `ix_nginx_2` should connect to the both networks, `ix_network` and the default docker network.

**Networking Setup**

We can get the list of networks by,

```docker
docker network ls
```

This will output the list of network.

> `bridge` is the default docker network. `host` is the network, skip `docker-virtual-network` and attach to host network directly. Disadvantages is, this skip default container security but could be useful for high throughput networking. `null` is not attached to anything.

To see the details of the default network,

```docker
docker network inspect bridge
```

In the output, under `containers`, a list of containers under the default `bridge` network will be displayed.

To create our own docker network named `ix_network`,

```docker
docker network create ix_network
```

This will create the network and return the network id.

We can verify this network existence by looking at the list of network by,

```docker
docker network ls
```

In output list, there should be a network named `ix_network`. It is using default driver bridge.

Now, we will create a nginx container named `ix_nginx_1` that should go under our new custom network, `ix_network`,

```docker
docker container run -d --name ix_nginx_1 --network ix_network nginx
```

To check, if the new container is running under our new created network,

```docker
docker network inspect ix_network
```

In the `containers` property, the container named `ix_nginx_1` should appear.

Now, create another container named `ix_nginx_2` under the default network,

```docker
docker container run -d --name ix_nginx_2 nginx
```

If we inspect the default network, in the containers property, the container, `ix_nginx_2` should appear.

```docker
docker network inspect bridge
```

**Verify Setup**

Make sure,

- `ix_nginx_1` container is inside the `ix_network` network, `docker network inspect ix_network`
  - We can inspect it through the `ix_network` network inspection
  - Or inspecting the container itself, `docker container inspect ix_nginx_1`
- `ix_nginx_2` container is inside the default network
  - We can inspect it through the default network inspection, `docker network inspect bridge`
  - Or inspecting the container itself, `docker container inspect ix_nginx_2`

**Experiments**

We can add the `ix_nginx_2` to the `ix_network` network using the `connect` command.

Now connect `ix_nginx_2` to the `ix_network` network

```docker
docker network connect ix_network ix_nginx_2
```

We can verify, `ix_nginx_2` is connected to two networks by,

```docker
docker container inspect ix_nginx_2
```

Under the `NetworkSettings.Networks` property, there should be the default `bridge` network and `ix_network`.

We can disconnect `ix_nginx_2` from the `ix_network` by disconnect command,

```docker
docker network disconnect ix_network ix_nginx_2
```

The beauty of containerization is using networking, even though we run all the app in a same server, we can protect them separately.

### DNS

In the world of containers, there is constant change of containers like, launching, stopping, expanding, shrinking etc. Containers can go away, fail on runtime, can crash. In these cases, docker will bring them up with a new IP. Since things are so dynamic and complicated, We can not relay on IP addresses, or deal with IP addresses inside the container.

For this, `docker` provide a built-in solution, `DNS-Naming`.

**Objective**

**Figure**

We can get list of containers,

```docker
docker container ls
```

Make sure, the container, `ix_nginx_1` is running under the `ix_network`. If not run them by,

```docker
docker container start ix_nginx_1
```

And verify the `ix_network` contains the container `ix_nginx_1`

```docker
docker network inspect ix_network
```

Let's create another container `ix_dns_nginx` inside the `ix_network`,

```docker
docker container run -d --name ix_dns_nginx --network ix_network nginx
```

Docker default `bridge` network does not support built in `DNS Resolution`.

Since `ix_nginx_1` and `ix_dns_nginx` are not the under default `bridge` network, it has the built in special feature, `DNS Resolution`.

Now, let's again check, the `ix_nginx_1` and `ix_dns_nginx` are in the same network `ix_network`,

```docker
docker network inspect ix_network
```

Under the `Containers` property, both containers should appear.

Lets, try to ping `ix_nginx_1` from the `ix_dns_nginx` container, by

```docker
docker container exec -it ix_dns_nginx ping ix_nginx_1
```

It is possible the latest `nginx` container does not have the `ping` program pre-installed. In this case, it will throw an error like this,

> OCI runtime exec failed: exec failed: container_linux.go:367: starting container process caused: exec: "ping": executable file not found in $PATH: unknown

If you notice this error, first install the `ping` program in the `ix_dns_nginx` container.

Run `bash` in the `nginx` container,

```docker
docker container exec -it ix_dns_nginx bash
```

From the `bash`, update the package manager and install the `ping` command,

```bash
apt-get update
apt-get install iputils-ping
```

Now we can ping the `ix_nginx_1` from the bash by,

```bash
ping ix_nginx_1
```

If you ping from the terminal first exit from the bash,

```bash
exit
```

Now from your own terminal run,

```docker
docker container exec -it ix_dns_nginx ping ix_nginx_1
```

We can ping another container in the same network without IP.

The resolution works in both ways, we can ping `ix_dns_nginx` from the `ix_nginx_1` server also.

This makes super easy when we need to talk from one container to another container. These containers IP address may not be same but their container name or the host names will always be the same.

> The default docker `bridge` network has a disadvantages. It does not have built in `DNS` server. In this case we have to use the `--link` flag. It's comparatively easier to use the custom network for this purpose, instead of using the default `bridge` network.

> Using `docker-compose`, we can automatically spin up a `virtual` network for us.
