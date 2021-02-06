## Production Workflow

Let's use docker in a production type environment. The important thing to keep in mind, we first explain the workflow without docker. Instead we discuss outside services that we are going to use to set up this development workflow. Once we get the bird view of the workflow and get the core design behind the workflow, then we introduce the docker and find how docker can facilitate everything.

We will create an application that will use docker and eventually push the application to `AWS`. Our workflow is going to be

- Develop
- Testing
- Deployment

Also for any changes, we will repeat the workflow again.

**Development Phase :** Our dev workflow is starting by creating a git repository. This git repository is going to be the center of coordination of all the code we will write. Out git repository will have two types of branch, master and feature branch. We make changes on the feature branch. By filing a PR we will merge the feature branch to master branch. When we do the PR there will be a series of actions, defining how we govern the codebase. The master branch will contain the very clean copy of our code base.

**Test Phase :** As soon as we make the PR, the `Travis CI` will pull the new and updated code and run the test. If all the tests executed successfully, then we will merge the code to the master branch.

**Production Phase :** After merging the feature branch, We then again push the code to `Travis CI` and run tests of the code. Any changes on the master branch will eventually and automatically be hosted in the `AWS Beanstalk`.

Now we need to find out how `docker` fits in this place.
