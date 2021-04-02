## Container Networking

While we start a container with `-p` flag, it exposes a port from the host machine to the docker container. In background, a lot more is going on, we will discuss here.

This `networking` staff is plugable and can be add or removed and we can change a lot of options under the hood.

When we start a container, we are particularly behind a docker network, called `bridge-network`. This `bridge-network` routes through `NAT Firewall` of the host IP. It is configured by the `docker-daemon` on our behalf. So the container can go back and forth of the outside internet and other network.

But whenever we need to build a communication between specific containers we do not need any port mapping using `-p`.

If we have a `node` application container and a `mongoDB` container, and they need to connect each other, we do not have to do the port mapping or open the port to the posts to the rest of the physical network.

And if we have another network with `php` server container and `mysql` database container, they can communicate each other but can not communicate with network of `node` and `mongoDB` servers network.

With this setup, If the `php server` have to connect with the `node server`, it has to go through the host machine network.

All these configurations are configurable, can be add, removed or changed.

> We can not have two container listening at the same port at the host level

**Figure**

### Networking CLI Hands On

Here we will create two docker network with containers in it. Then play around of adding, removing containers from these networks.

**Create Setup**

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

To create our own docker network named `my_app_net`,

```docker
docker network create my_app_net
```

This will create the network and return the network id.

We can verify this network existence by looking at the list of network by,

```docker
docker network ls
```

In output list, there should be a network named `my_app_net`. It use default driver bridge.

Now, we will create a container named `my_app_net` that should go under our new custom network, `my_app_net`,


```docker
docker container run -d --name new_nginx --network my_app_net nginx
```

To check, if the new container is running under our new created network,

```docker
docker network inspect my_app_net
```

In the `containers` property, the container named `new_nginx` should appear.

Let's create another network named `another_net`,

```docker
docker network create another_net
```

Now, create a container named `another_nginx` under the network `another_net`,

```docker
docker container run -d --name another_nginx --network another_net nginx
```

If we inspect the network, `another_net`, in the containers property, the container, `another_nginx` should appear.

```docker
docker network inspect another_net
```

**Verify Setup**

Make sure,

- `new_nginx` container is inside the `my_app_net` network
  - Inspect the `my_app_net` by `docker network inspect my_app_net`
  - Under containers, the `new_nginx` should appear
- `another_nginx` container is inside the `another_net` network
  - Inspect the `another_net` by `docker network inspect another_net`
  - Under containers, the `another_nginx` should appear

**Experiments**

We can add the `new_nginx` to the `another_net` network using the `connect` command.

```docker
docker network connect --help
```

Now connect `new_nginx` to the `another_net` network

```docker
docker network connect another_net new_nginx
```

We can verify, `new_nginx` is connected to two network by,

```docker
docker container inspect new_nginx
```

In the `NetworkSettings.Networks` property, both network, `my_app_net` (original default bridge network) and `another_net` (new network, with new ip) should appear.


We can disconnect `new_nginx` from the `another_net` by disconnect,

```docker
docker network disconnect another_net new_nginx
```

The beauty of containerization is using networking, even though we run all the app in a same server, we can protect them easily.

###  DNS

In the world of containers, there is constant change of containers like, launching, stopping, expanding, shrinking etc. Container can go away, fail on runtime, in these cases, docker bring it up in different place. Since things are so dynamic and completed, We can not relay on IP address, or deal with IP addresses inside the container.

For this, `docker` provide a built-in solution, `DNS-Naming`.

We can get list of containers,

```docker
docker container ls
```

Make sure, the container, `new_nginx` and `another_nginx` is running. If not run them by,

```docker
docker container start new_nginx
docker container start another_nginx
```

Make sure, we have a network, `my_app_net` with the `new_nginx` container in it. We can ensure by,

```docker
docker network inspect my_app_net
```

Since `my_app_net` is not the default `bridge` network, it has a special feature, `DNS Resolution`.

```docker
docker container run -d --name my_nginx --network my_app_net nginx
```

Now, if we check the network,

```docker
docker network inspect my_app_net
```

Lets, try to ping `new_nginx` from the `my_nginx` container, by

```docker
docker container exec -it my_nginx ping new_nginx
```

If you notice, the `ping` command is not available in the `my_nginx` container, let's intall it first.

Run `bash` in the `nginx` container,

```docker
docker container exec -it my_nginx bash
```

From the `bash`, update the package manager and install the `ping` command,

```bash
apt-get update
apt-get install iputils-ping
```

Now we can ping the `new_nginx` from the bash by,

```bash
ping new_nginx
```

Or from our terminal,

```docker
docker container exec -it my_nginx ping new_nginx
```

The resolution works in both ways, we can ping `my_nginx` from the `new_nginx` server also.

This makes super easy when we need to talk to a container from another container. These containers IP address  may not be same but their container name or the host names will always be the same.

The default docker `bridge` network has a disadvantages. It does not have built in `DNS` server. In this case we have to use the `--link` flag. It's comparatively easier to use the custom network for this purpose, instead of using the default `bridge` network.

When we use `docker-compose`, the `docker-compose` automatically spin up a `virtual` network for us.

### An Interesting IP Fact

Let's run `nginx` server on port `80`,

```docker
docker container run -p 80:80 --name webhost -d nginx
```

In the container, we can check the `PORT` of the container by,

```docker
docker container port webhost
```

I got output of,

```txt
80/tcp -> 0.0.0.0:80
```

Since, we are mapping the port in container at `80`, this seems fine.

Let's check the `IP` of the container,

```docker
docker container inspect --format '{{ .NetworkSettings.IPAddress }}' webhost
```

In my machine, I got container IP,

```txt
172.17.0.3
```

Now, to check my host machine IP, first install a tool named `net-tools`.

```bash
sudo apt-get install -y net-tools
```

Assuming the `net-tools` is installed in the machine, I checked the IP of my host machine,

```bash
ifconfig usb0
```

I got my host machine `IP` as output, 

```bash
192.168.42.203
```

It seems, the container IP `172.17.0.3` and host machine IP `192.168.42.203` is not same.