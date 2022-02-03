import React from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";
import "ace-builds/src-noconflict/mode-json";

export interface EditorPropsType {
  value: string;
  onChange: (value: string) => void;
  parseDebounceTime?: number;
  inboundAnnotations?: Ace.Annotation[];
}

const Editor = ({
  value,
  onChange,
  parseDebounceTime = 1500,
  inboundAnnotations,
}: EditorPropsType) => {
  return (
    <>
      <div data-testid="test-case-editor">
        <AceEditor
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
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
