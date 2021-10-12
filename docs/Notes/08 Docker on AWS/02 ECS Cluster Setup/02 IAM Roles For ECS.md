### IAM Roles For ECS

---

To set up the `ECS` we will require 4 types of roles. If you go to `IAM -> Roles -> Create Role -> Elastic Container Service`, you will notice the 4 roles use case. We will have to go through each of them and create these roles.

1. **Role For EC2**: Will be attached with to the `EC2` instance. This will allow the `ECS Agent` to communicate with the `ECS` and `ECR`. Create a role named `ecsInstanceRole` from `EC2 Role for Elastic Container Service`.

   > Allows EC2 instances in an ECS cluster to access ECS.

2. **Role for `ECS`**: Will be attached to the `ECS`. This will allow `ECS` to manage resources on our behalf. Create a role named `ecsRole` from `Elastic Container Service`.

   > Allows ECS to create and manage AWS resources on your behalf.

3. **Role for `ECS Task`**: Will be attached to the `ECS Task`. This will allow execute the task. Create a role named `ecsAutoscalingRole` from the `Elastic Container Service Autoscale`.

   > Allows Auto Scaling to access and update ECS services.

4. **Role for `Auto Scaling`**: Only if we use EC2 instance to run docker this role will be required. For `Fargate` we will not require any of these. Create a role named `ecsTaskExecutionRole` with only `AmazonECSTaskExecutionRolePolicy`policy from`Elastic Container Service Task`.

   > Allows ECS tasks to call AWS services on your behalf.
