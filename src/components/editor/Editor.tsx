import React from "react";
import AceEditor from "react-ace";
import { Button } from "@madie/madie-components";
import tw from "twin.macro";

const Editor = () => {
  return (
    <>
      <div>
        <AceEditor
          mode="json" // Temporary value of mode to prevent a dynamic search request.
          theme="monokai"
          name="ace-editor-wrapper"
          enableBasicAutocompletion={true}
          width="100%"
          showPrintMargin={true}
          showGutter={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    </>
  );
};

export default Editor;
