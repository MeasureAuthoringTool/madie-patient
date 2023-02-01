import React from "react";
import { Button } from "@madie/madie-design-system/dist/react";

const FileUploader = ({ onFileImport }) => {
  // reference to file input element
  const fileInput = React.useRef(null);
  const importTestCase = () => {
    fileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded) {
      onFileImport(fileUploaded);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInput}
        onChange={handleChange}
        style={{ display: "none" }}
        data-testid="import-file-input"
      />
      <Button
        type="button"
        onClick={importTestCase}
        variant="outline"
        data-testid="import-test-case-btn"
      >
        Import
      </Button>
    </>
  );
};
export default FileUploader;
