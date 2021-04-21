### Overview

---

With containerization technology we can deploy our apps as platform service beyond any hardware, whether it is AWS, GCS, Digital Ocean Droplet ect. But after deploying a container, we have to consider scaling the app. These brings new problems for a small organization or solo developer. With `Docker Swarm` we can manage the follows,

- Automate the container lifecycle
- Scaling in/out
- Restart or create container on failure
- Container upgrade (Blue/Green Deployment)
- Cross container networking
- Storing secrets, keys, passwords
