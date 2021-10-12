### Overview

---

**ECS Clusters**

- Logical group of EC2 instance
- In this case, the EC2 instance has the ECS agents. Alternatively, we can use AMI which is already included the ECS agents.
- ECS Agents responsible for
  - Connect ECS Service
  - Logging in Cloudwatch
  - Integrate with ECR
- In these EC2 instance, there should be multiple tasks with appropriate IAM role. If the task needs to interact with S3, it should have the IAM role with S3 related permission included.
