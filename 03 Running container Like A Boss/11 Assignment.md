## Assignments

Here we will use same host name for multiple docker container.

We will run two container from `elastic-search` named `elasticsearch1` and `elasticsearch2`. Both container should have same dns name, `search`.

From alpine, we will run `nslookup` and ensure, the `search` is the dns name of both container.

From `centos` we will verify. `search:9200` work similar to load balancer between these two containers.

- Create 2 containers from `elasticsearch:2`
  - Use `--network-alias search` while creating to provide additional `DNS` name
- Create container from `alpine:3.10`
  - From `alpine` use `--net` to see, both containers with same `DNS` name
- Create container from `centos`
  - `curl` to `search:9200` and see both name field shows

Check network list.

```docker
docker network ls
```

Create a custom network named `dns_rest`, we will do all the work.

```docker
docker network create dns_res
```

Make sure network is created and in containers, no containers is connected.

```docker
docker network inspect dns_res
```

Create two container in the network `dns_res`, with

- named `elastic_search1`, and `elastic_search2`
- should go under network `dns_res`
- should have network alias `search`

```docker
docker container run --name elastic_search_1 --network dns_res --network-alias search -d elasticsearch:2
```

```docker
docker container run --name elastic_search_2 --network dns_res --network-alias search -d elasticsearch:2
```

Check the network and these two container should be under the `dns_res` network.

```docker
docker network inspect dns_res
```

Run a container of `alpine` and open shell inside,

```docker
docker container run --network dns_res -it alpine:3.10 sh
```

Check the two container is exist in the `search` hostname using `nslookup tool`

```sh
nslookup search
```

This should give output like,

```txt
Name:      search
Address 1: 172.25.0.2 elastic_search_1.dns_res
Address 2: 172.25.0.3 elastic_search_2.dns_res
```

Now create a container of `centos` and open terminal in it,

```docker
docker container run -it --network dns_res centos:7
```

Run the following couple of times, only these two containers should appear randomly.

```bash
curl -s search:9200
```
