import Dialog from "@mui/material/Dialog";
import React, { useCallback, useState } from "react";
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Group } from "@madie/madie-models";
import { processPatientBundles } from "../../util/ImportHelper";
import { useDropzone } from "react-dropzone";
import "./TestCaseImportDialog.css";
import * as _ from "lodash";

const TestCaseImportDialog = ({ open, handleClose, measure, onImport }) => {
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Math.random().toString(36));
  const [errorMessage, setErrorMessage] = useState(null);
  const [testCases, setTestCases] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFileInputKey(Math.random().toString(36));
    const importFile = acceptedFiles[0];
    setFile(importFile);
    const fileReader = new FileReader();
    fileReader.onload = async function (e) {
      const content: string = e.target.result as string;
      let patientBundles = null;
      try {
        patientBundles = JSON.parse(content);
      } catch (error) {
        setErrorMessage(
          "An error occurred while parsing the import file. JSON content is not properly formatted."
        );
      }
      if (patientBundles && patientBundles.length > 0) {
        try {
          const measureGroup: Group = measure?.groups?.[0];
          const testCases = processPatientBundles(patientBundles, measureGroup);
          setTestCases(testCases);
        } catch (error) {
          setErrorMessage(
            "An error occurred while processing the import file. Please try to regenerate the file and re-import, or contact the Help Desk."
          );
        }
      } else if (_.isNil(errorMessage)) {
        setErrorMessage("No patients were found in the selected import file!");
      }
    };
    fileReader.readAsText(importFile);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const renderFileDrop = () => {
    return (
      <Paper style={{ padding: 20 }}>
        <div {...getRootProps({ className: "dropzone" })}>
          <input key={fileInputKey} {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </Paper>
    );
  };

  const renderFileContent = () => {
    return (
      <div>
        <div>Test Cases from File: {file.name}</div>
        <Divider />
        <div style={{ maxHeight: 450, overflowY: "scroll" }}>
          {testCases?.map((tc) => (
            <div>
              <span>{tc.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="responsive-dialog-title">Test Case Import</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Alert severity="warning" style={{marginBottom: 10}}>
            Please Note: Expected Values for group populations are not imported
            and must be manually updated!
          </Alert>
          {errorMessage && <span>{errorMessage}</span>}
          {file ? renderFileContent() : renderFileDrop()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            setFile(null);
            setTestCases([]);
            setFileInputKey(Math.random().toString(36));
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onImport(testCases)}
          autoFocus
          disabled={_.isNil(testCases) || testCases.length === 0}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestCaseImportDialog;
