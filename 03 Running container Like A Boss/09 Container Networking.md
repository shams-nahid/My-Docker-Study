## Container Networking

```docker
docker container run -p 80:80 --name webhost -d nginx
```

```docker
docker container port webhost
```

```txt
80/tcp -> 0.0.0.0:80
```

```docker
docker container inspect --format '{{ .NetworkSettings.IPAddress }}' webhost
```

```txt
172.17.0.3
```

```bash
sudo apt-get install -y net-tools
```

```bash
ifconfig usb0
```

```bash
192.168.42.203
```