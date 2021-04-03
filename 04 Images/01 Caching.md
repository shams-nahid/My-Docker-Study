## Caching

### Image Layers

We can look for the image history by,

```docker
docker image history nginx
```

This should output the `nginx` image history.


```docker
docker image inspect nginx
```

We get a list of image layers. All the images start from a scratch. Each layer contains the increment of the previous one. It could be `changes in file system` or `adding some config/metadata to the image`.

We can have on layer, we can even have thousands of layers.

`Figure Image Layers`

We never store the same image layer twice in the system.

`Figure Copy On Write`

`docker image inspect` give us metadata, some interesting config we can look for,

exposed ports

env variables

start up command


