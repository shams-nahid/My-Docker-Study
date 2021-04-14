### Tagging

---

we can get the list of images by,

```docker
docker image ls
```

In the image list, we can notice docker images does not have a name.

> Only official images can have root namespace. Other images repository name be like `user_name/repository_name`

The image tag is not exactly a version or branch, it's the git tag and it can represent both.

> In docker world, `latest` tag is more of a meaning to `default` or `stable` image. `latest` tag in docker image does not imply the latest image. It is possible to take older image and tagged as `latest`

Let's assume, we have the nginx image with latest tag. If not get it,

```docker
docker pull nginx:latest
```

The latest nginx also tagged with `mainline`. So If we try to pull the `nginx:mainline`,

```docker
docker pull nginx:mainline
```

Instead of download, it will use the downloaded `nginx:latest` image layer.

Now, if we print the list of images,

```docker
docker image ls
```

We will see the nginx image has same `IMAGE ID` but different tag.

### Tag Existing Image

---

We can create a tagged target image from the existing image by [tag](https://docs.docker.com/engine/reference/commandline/image_tag/) command,

```docker
docker image tag nginx bmshamsnahid/nginx
```

If we now see the image list,

```docker
docker image ls
```

We will see a new nginx image repository `bmshamsnahid/nginx` with `latest` image. This new image should also have the same image id.

> If we do not specify the tag, it will take the `latest` tag by default

### Pushing Image to Docker Hub

---

Make sure you have a account in [docker hub](https://hub.docker.com/) and you are logged in to your local machine,

```docker
docker login
```

Now, push our latest image to docker hub,

```docker
docker push bmshamsnahid/nginx
```

In docker hub, we should see the image `bmshamsnahid/nginx` with `latest` tag.

Now to add another tag, `testing`, we can run,

```docker
docker tag bmshamsnahid/nginx bmshamsnahid/nginx:testing
```

We can verify the `testing` tag in local image list by,

```docker
docker image ls
```

In the output list, we should see a image `bmshamsnahid/nginx` with `testing` tag.

We can push this newly `testing` tagged image to docker hub by,

```docker
docker push bmshamsnahid/nginx:testing
```

Since the image layer is same, only the tag is different, we should see `Layer already exists` in the console. Also it should add a image tag `testing` in the docker hub.

So if an image layer exist in the docker hub, it does not upload twice. And same for the local machine, if an image layer exists in the local machine cache, it does not download twice.

> To upload a image in private repository, we first have to create a private repository in the docker hub
