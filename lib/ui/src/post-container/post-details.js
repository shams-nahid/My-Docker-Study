import React, { useEffect } from 'react';
const ReactMarkdown = require('react-markdown');

function PostDetails({ selectedNode }) {
  const { content } = selectedNode;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ height: "100%", paddingLeft: '15px', paddingBottom: '15px' }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default PostDetails;
