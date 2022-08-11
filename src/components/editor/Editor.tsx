import React, { useEffect, useRef } from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-sql";
// import {
//   CqlHighlightMode
// } from "@madie/madie-editor";
import CqlMode from "./cql-mode";

export interface EditorPropsType {
  value: string;
  onChange?: (value: string) => void;
  parseDebounceTime?: number;
  inboundAnnotations?: Ace.Annotation[];
  setEditor?: (editor: Ace.Editor) => void;
  readOnly?: boolean;
  editorType?: string;
  dataTestId?: string;
}

const Editor = ({
  value,
  onChange,
  parseDebounceTime = 1500,
  inboundAnnotations,
  setEditor,
  readOnly,
  editorType,
  dataTestId,
}: EditorPropsType) => {
  const aceRef = useRef<AceEditor>(null);
  useEffect(() => {
    const cqlMode = new CqlMode();
    // @ts-ignore
    aceRef?.current?.editor?.getSession()?.setMode(cqlMode);
  }, []);

  return (
    <>
      <div data-testid={dataTestId}>
        <AceEditor
          value={value}
          ref={editorType !== "measureCql" ? null : aceRef}
          onChange={(value) => {
            onChange(value);
          }}
          onLoad={(editor: Ace.Editor) => {
            if (setEditor) {
              setEditor(editor);
            }
          }}
          //mode="json"
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
