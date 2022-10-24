import React, { useRef, useState } from "react";
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
}

var originalCommands;
const setCommandEnabled = (editor, name, enabled) => {
  var command = editor.commands.byName[name];
  var bindKeyOriginal;
  if (!originalCommands) {
    originalCommands = JSON.parse(JSON.stringify(editor.commands));
  }
  var bindKeyOriginal = originalCommands.byName[name].bindKey;
  command.bindKey = enabled ? bindKeyOriginal : null;
  editor.commands.addCommand(command);
};

const Editor = ({
  value,
  onChange,
  parseDebounceTime = 1500,
  inboundAnnotations,
  readOnly,
}: EditorPropsType) => {
  const [editor, setEditor] = useState<Ace.Editor>();
  const aceRef = useRef<AceEditor>(null);

  aceRef?.current?.editor?.on("focus", function () {
    setCommandEnabled(editor, "indent", true);
    setCommandEnabled(editor, "outdent", true);
  });

  aceRef?.current?.editor?.commands.addCommand({
    name: "escape",
    bindKey: { win: "Esc", mac: "Esc" },
    exec: function () {
      setCommandEnabled(editor, "indent", false);
      setCommandEnabled(editor, "outdent", false);
    },
  });

  return (
    <>
      <div data-testid="test-case-json-editor">
        <AceEditor
          ref={aceRef}
          value={value}
          ref={aceRef}
          onChange={(value) => {
            onChange(value);
          }}
          onLoad={(aceEditor: Ace.Editor) => {
            if (setEditor) {
              setEditor(aceEditor);
            }
          }}
          mode="json" // Temporary value of mode to prevent a dynamic search request.
          theme="monokai"
          name="ace-editor-wrapper"
          enableBasicAutocompletion={true}
          width="100%"
          height="calc(100vh - 135px)"
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
