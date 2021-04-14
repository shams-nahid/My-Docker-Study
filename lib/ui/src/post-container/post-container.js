import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import TreeViewContainer from "./tree-view";
import PostDetails from "./post-details";
import axios from "axios";

function PostContainer() {
  const [fileTree, setFileTree] = useState([]);
  const [applicationConfig, setApplicationConfig] = useState({});
  const [selectedNode, setSelectedNode] = useState({});

  const onSelectNode = (node) => {
    window.scrollTo(0, 0);
    setSelectedNode(node);
  };

  useEffect(() => {
    axios
      .get("/tree.json")
      .then(function (response) {
        setFileTree(response.data || {});
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    axios
      .get("/config.json")
      .then(function (response) {
        setApplicationConfig(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      style={{ height: "100%" }}
    >
      <Grid item md={3} sm={3} xs={3} style={{ height: "100%" }}>
        <TreeViewContainer
          applicationConfig={applicationConfig}
          fileTree={fileTree}
          onSelectNode={onSelectNode}
        />
      </Grid>
      <Grid item md={9} sm={9} xs={9} style={{ height: "100%" }}>
        <PostDetails selectedNode={selectedNode} />
      </Grid>
    </Grid>
  );
}

export default PostContainer;
