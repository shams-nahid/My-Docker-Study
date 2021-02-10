## Production App Workflow With Docker

Let's use docker in a production type environment. The important thing to keep in mind, we first explain the workflow without docker. Instead we discuss outside services that we are going to use to set up this development workflow. Once we get the bird view of the workflow and get the core design behind the workflow, then we introduce the docker and find how docker can facilitate everything.

We will create an application that will use docker and eventually push the application to `AWS`. Our workflow is going to be

- Develop
- Testing
- Deployment

Also for any changes, we will repeat the workflow again.

**Development Phase :** Our dev workflow is starting by creating a git repository. This git repository is going to be the center of coordination of all the code we will write. Out git repository will have two types of branch, master and feature branch. We make changes on the feature branch. By filing a PR we will merge the feature branch to master branch. When we do the PR there will be a series of actions, defining how we govern the codebase. The master branch will contain the very clean copy of our code base.

**Test Phase :** As soon as we make the PR, the `Travis CI` will pull the new and updated code and run the test. If all the tests executed successfully, then we will merge the code to the master branch.

**Production Phase :** After merging the feature branch, We then again push the code to `Travis CI` and run tests of the code. Any changes on the master branch will eventually and automatically be hosted in the `AWS Beanstalk`.

Now we need to find out how `docker` fits in this place. To execute this workflow, we do not need to make use of `Docker`. But using docker will make the workflow lot lot easier. Thats the soul purpose of docker. It's not necessarily a requirement, it just make developer life easier.

Docker is not the focus here, it's more of using these 3rd party services (like, Github, Travis CI, AWS Beanstalk) with docker.

### Generating a Project

---

We will use a `react` for simplicity. To create a react project, make sure `node.js` is installed in your system. Then create the project named `frontend` by the followings,

```bash
npm create-react-app frontend
```

This will create the react project and install all the necessary dependencies.

Now go to the project directory,

```bash
cd frontend
```

To run the test in local machine, we can use

```bash
npm run test
```

To build the application for future deployment, we can build using

```bash
npm run build
```

An finally to run the application in the local environment, we can use

```bash
npm run start
```

### Generating Dev Dockerfile

---

First go to the project directory. Here we will create a `Dockerfile` named `Dockerfile.dev`. The purpose of using `.dev` with the `Dockerfile` is to make clear that, this docker file is only using in the development environment.

In future, we will use another `Dockerfile` with simply name `Dockerfile`, without any extension for our production environment.

So, lets create the `Dockerfile.dev` in the project root directory,

```bash
touch Dockerfile.dev
```

Inside the `Dockerfile.dev` we will write configuration to make our image.

Our `Dockerfile.dev` will be similar like the following.

```docker
# Define base image
FROM node:alpine

# Define working directory inside the container
WORKDIR /app

# Copy the package.json file to the project directory
COPY package.json .
# Install the dependencies
RUN npm install

# Copy all the source code from host machine to the container project directory
COPY . ./

# Start up command of the container to run the server
CMD ["npm", "run", "start"]
```

### Building Image From Dockerfile

---

Since we are not using default name of `Dockerfile`, instead we are using `Dockerfile.dev` we have to specify the name during building image. To do so, we can use `-f` flag, that helps to specify the `docker file` name. This time, during development, our build instruction will be,

```bash
docker build -f Dockerfile.dev .
```

When we initially create our react application using `create-react-app`, the `create-react-app` automatically install all the `node modules` inside the `node_modules` directory. Now, when we are building the image out of the app, we will again installing the dependencies using `RUN npm install` instruction in the `Dockerfile.dev` file. We do not need the `node_modules` in the host machine, it usually increase the duration of image building process, since we are running the app inside the `container`. So we can delete the `node_modules` directory from the `host machine`.

> `node_modules` directory is not necessary in the `host machine` project directory, it increase the time to build the image. We can delete `node_modules` from project directory.

If we again run the previous instruction to build the image, we will get much faster output,

```bash
docker build -f Dockerfile.dev .
```

### Run Container in Interactive Mode

Now we can run a container from the image by

```bash
docker run -it -p 3000:3000 IMAGE_ID
```

If we observe closely, we can notice, while we made changes in the codebase, the hot reloading is not working. The image was build on the snapshot of files. One way is after each changes in the code base we will rebuild the image. But this is a costly and inefficient approach. So we need to find a way to enable hot reload inside inside the image.

### Enabling Hot Reload Using Docker Volume

In the last section, we made changes in a file and the changes was not reflected in the container. Now we will figure out a way to solve the issue without stopping, rebuild and restarting the container.

A docker volume essentially a mapping of directory between host machine and container.

With docker volume, we can use the reference of local machine directory from the host machine. In this case, we do not copy the directory of the local machine in the container, instead, use the host machine directory by reference from container.

To use the volume mapping we need to use the followings,

```bash
docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app image_id
```

Here we have used two switches. Each switch has a `-v` flag which is used to set up a volume. The `${pwd}` is stands for `print working directory`, used to get the current application path.

Here first switch is `-v /app/node_modules`, is not using the reference. Instead it says, not to map the `/app/node_modules` of the host machine.

For the second switch, `-v ${pwd}:/app`, we are using the host machine volume. The `:` stands when we use host machine directory as reference in the docker.

If the hot reload not work, need to create a `.env` in the `root directory` and need to add `CHOKIDAR_USEPOLLING=true`.
The `.env` file should be

```
CHOKIDAR_USEPOLLING=true
```
