const fs = require("fs");

const basePath = "../../";
console.log("Starting parsing...");
try {
  require("markdown-blog-content-parser").parseMarkdownTree(
    basePath,
    ["config.json", "deploy.sh", "README.md", ".git", "lib", "resource", ".gitignore"],
    (res) => {
      console.log("Parsing completed.");
      console.log("Saving parsed file...");
      fs.writeFileSync("../build/tree.json", JSON.stringify(res), "utf8");
      console.log("File saved.");
    }
  );
} catch (error) {
  console.error("Error in parsing operation");
  console.error(error);
}
