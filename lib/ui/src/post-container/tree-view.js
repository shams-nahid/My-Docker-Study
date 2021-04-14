import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400
  }
});

export default function TreeViewContainer({ fileTree = [], onSelectNode, applicationConfig = {} }) {
  const classes = useStyles();

  const renderTreeNode = nodes =>
    nodes.map(node => {
      const { type, name, children } = node;
      let displayLabel = name;
      try {
        const initialNumberPart = name.split(' ')[0];
        if (applicationConfig.removeIndex && !isNaN(parseInt(initialNumberPart))) {
          displayLabel = name.replace(initialNumberPart, '');
        }
      } catch (err) {
        console.log('invalid name pattern');
        console.log('name: ', name);
        console.log({ fileTree });
      }
      return (
        <TreeItem
          style={{ backgroundColor: '#b9c3ff' }}
          nodeId={name}
          label={displayLabel}
          onClick={() => type === 'file' && onSelectNode(node)}
        >
          {children ? renderTreeNode(children) : null}
        </TreeItem>
      );
    });

  const nodesId = applicationConfig.expandParent ? (fileTree || []).map(tree => tree.name) : [];

  return (fileTree || []).length ? <div style={{ height: '100vh', backgroundColor: '#b9c3ff' }}>
    <TreeView
      defaultExpanded={nodesId}
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTreeNode(fileTree)}
    </TreeView>
  </div> : null
}
