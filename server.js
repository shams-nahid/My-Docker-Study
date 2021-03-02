const { runServer } = require("markdown-blog-content-parser");

const port = 8083;

runServer({
  port,
  skip: [
    ".ignore.Blog",
    "node_modules",
    "resource",
    ".gitignore",
    "package.json",
    "server.js",
    "yarn.lock",
    ".git",
  ],
});
