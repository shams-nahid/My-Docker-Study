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

```docker
docker container ls
```

Output list of network.

> bridge is the default docker network
> host is the network, skip docker virtual network and attach to host network directly. skip default containeration security. usefull for high throughput networking.
> null is not attached to anything

```docker
 docker network inspect bridge
```


in the output, under `containers`, a list of containers under the network will be displayed.

to create own

```docker
docker network create my_app_net
```

will return the network id

```docker
docker network ls
```

in output there should be a network named `my_app_net`. It use default driver bridge.


run nginx in `my_ap_net`

```docker
docker container run -d --name new_nginx --network my_app_net nginx
```

```docker
docker network inspect my_app_net
```

in the containers property, the container named `new_nginx` should appear

create another network

```docker
docker network create another_net
```

Create a nginx in `another_net`

```docker
docker container run -d --name another_nginx --network another_net nginx
```

make sure, in the `containers` property, `another_nginx` is in `another_net` and `new_nginx` is in `my_app_net` network,

```docker
docker network inspect my_app_net
```

`new_nginx` should appear in the `my_app_net` containers

```docker
docker network inspect another_net
```

`another_nginx` should appear in the `another_net` containers 

Now add the `new_nginx` to the `another_net` network

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

The beauty of containeration is using networking, even thoug we run all the app in a same server, we can protect them easily.

###  DNS

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