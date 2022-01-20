import React, { useState } from "react";
import AceEditor from "react-ace";

const Editor = () => {
  return (
    <>
      <AceEditor
        mode="json" // Temporary value of mode to prevent a dynamic search request.
        theme="monokai"
        width="100%"
        name="ace-editor-wrapper"
        enableBasicAutocompletion={true}
        editorProps={{ $blockScrolling: true }}
      />
    </>
  );
};

export default Editor;
