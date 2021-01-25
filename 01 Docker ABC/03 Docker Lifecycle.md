## Docker Lifecycle

When we run a docker container using `run` command,

```bash
docker run image_name
```

Then, the `docker run` is equivalent to the following 2 commands:

1. `docker create`
2. `docker start`

With `docker create`, the `file system snapshot` of the image is being copied to `isolated physical storage`.

Then with `docker start` we start the `container`.

**Example :**

Let's do the hands on what we are claiming with a image `hello-world`.

```bash
docker create hello-world
```

This will return the `id` of the created container.

Using the `id` we can now start the docker.

```bash
docker start -a id
```

This will give us the output `Hello from Docker!`.

Here the `-a` flag watch out the `container` output and print it in `console`.
