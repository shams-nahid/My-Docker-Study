### First Container Launch

---

We are going to launch a `nginx` server in the `Fargate`.

- Logged in with a user `ecs-course` we created.
- Go to service `Elastic Container Service`
- Click get started
- We have to
  - Define container
  - Define task
  - Define service
  - Define Cluster

**Define Container**

- Select `nginx`
- Ensure `Compatibilities` as `FARGATE`
- We can change the configuration by click `Edit`, ex change the name to `quickstart-nginx-td`
- Click `next` and define the service

In the top image, you should notice, the `Container` and `Task` definition is completed by green check mark.

- From the `Edit` button we can change the service name and lets make the name `quickstart-nginx-service`
- Click `next` and define the cluster

In the top image this time the service should also get the green check mark.

- In cluster section, change the name to `qucikstart-nginx-cluster`
- Click `next`, review all the config and created all the services, it might take couple of minutes.
- After completion, we can view the services by clicking the `View Service` button.

Now, when we go to the `ECS` service dashboard, we should see our created cluster. Go to the cluster `qucikstart-nginx-cluster`

From the `Task` details, we can get the IP of the server. If we visit, we should see `Welcome to nginx!`.

**To avoid any unnecessary costing/billing, select the service and delete it.**

To delete,

- From `ECS` dashboard, select the cluster and go to details
- Select the service and delete it

To make sure the service is deleted, under the cluster dashboard, `0` services and `0` tasks are running.
