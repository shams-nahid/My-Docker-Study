# define base image
FROM node:alpine

# define working directory inside the container
WORKDIR /app

# Copy the package.json file to the project directory
COPY package.json .
# install all the dependencies
RUN npm install

# Copy all the source code from host machine to the container project directory
COPY . .

# define the start up command of the container to run the server
CMD ["node", "index.js"]
