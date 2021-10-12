## IP Fact

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