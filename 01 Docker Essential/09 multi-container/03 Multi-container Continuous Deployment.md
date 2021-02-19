## Multi-container Continuous Deployment

Our `Travis CI` si already configured to build the image and push the image to the `Docker Hub`. Now we have to think about how use these images and deploy them to production. To deploy these image we are going to make use of `Elastic Beanstalk`.

When we have only one container, the `Elastic Beanstalk` will automatically build and run the the container, we do not have to set up any custom configuration. In the root directory, we just have to take the project files and a `Dockerfile` and `Elastic Beanstalk` do the rest.

Now, the scenario is different. we have multiple `Dockerfile` in different folder. Anytime we have multiple `Dockerfile`, we have to tell the `Elastic Beanstalk` with little configuration, how these `Dockerfile` will be treated.

To put the configuration for `Elastic Beanstalk`, how our multiple `Dockerfile` will be treated, we have to create special config file in the project directory named `Dockerrun.aws.json`. This config file will define,

- From where the `image` files will be pulled
- Resources allocated for the `image`
- Port mapping
- Some associated configurations like handling environment variables

The configurations of `Dockerrun.aws.json` will be very much similar to the `docker-compose.yml` configuration.

> `docker-compose.yml` is all about, how we build images, whereas `Dockerrun.aws.json` is all about definitions of container.

> When it comes to handle multiple container, the `Elastic Beanstalk` does not know, how to handle multiple containers. For multiple container, it delegates the tasks to another `AWS` server named `Elastic Container Service` aka `ECS`. In the `ECS` for each container, we will define `Task`, also known as `Task Definition`. A doc for defining the container configuration is given [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-task-definition.html#task-definition-template).

## Container Definition

---

Go to the project root directory and create a file named `Dockerrun.aws.json`,

```bash
touch Dockerrun.aws.json
```

For the `Dockerrun.aws.json` file, we have to consider the following conventions,

- **version :** We have to specify the template version. Different version compile differently
- List of containers Definitions
- For each container
  - **name :** Name should be the directory name
  - **image :** Image name that is deployed to the docker hub with the docker hub user name
  - **hostname :** Hostname should be the service name. This is also being used in the nginx configuration
  - **essential :** If this is true, crashing this container will make crash other containers. Among all the container, one should marked as `essential`
  - **links :** To do the routing we have to use the directory name

> For the worker and nginx, since no one is routing to these, we do not need any `hostname` in these configuration.

> Since, the `nginx` server is responsible for communicating with the outside world, we need to do the port mapping.

> Also, in the `nginx` server configuration we have to specify the routes to other containers

Our `Dockerrun.aws.json` should be like the following,

```json
{
  "AWSEBDockerrunVersion": 2,
  "ContainerDefinitions": [
    {
      "name": "client",
      "image": "bmshamsnahid/multi-client",
      "hostname": "client",
      "essentials": false
    },
    {
      "name": "server",
      "image": "bmshamsnahid/multi-server",
      "hostname": "api",
      "essentials": false
    },
    {
      "name": "worker",
      "image": "bmshamsnahid/multi-worker",
      "hostname": "worker",
      "essentials": false
    },
    {
      "name": "nginx",
      "image": "bmshamsnahid/multi-nginx",
      "hostname": "nginx",
      "essentials": true,
      "portMappings": [
        {
          "hostPort": 80,
          "containerPort": 80
        }
      ]
    }
  ]
}
```
