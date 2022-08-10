import React from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";
import "ace-builds/src-noconflict/mode-json";

export interface EditorPropsType {
  value: string;
  onChange?: (value: string) => void;
  parseDebounceTime?: number;
  inboundAnnotations?: Ace.Annotation[];
  setEditor?: (editor: Ace.Editor) => void;
  readOnly?: boolean;
  editorType?: string;
}

const Editor = ({
  value,
  onChange,
  parseDebounceTime = 1500,
  inboundAnnotations,
  setEditor,
  readOnly,
  editorType,
}: EditorPropsType) => {
  return (
    <>
      <div data-testid="test-case-editor">
        <AceEditor
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
          onLoad={(editor: Ace.Editor) => {
            if (setEditor) {
              setEditor(editor);
            }
          }}
          mode={editorType !== "measureCql" ? "json" : "sql"} // Temporary value of mode to prevent a dynamic search request.
          //theme= {editorType !=="measureCql" && "monokai"}
          theme="monokai"
          name="ace-editor-wrapper"
          enableBasicAutocompletion={true}
          width="100%"
          height="909px"
          showPrintMargin={true}
          showGutter={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            autoScrollEditorIntoView: true,
          }}
          editorProps={{ $blockScrolling: true }}
          readOnly={readOnly}
          wrapEnabled={true}
        />
      </div>
    </>
  );
};

export default Editor;
