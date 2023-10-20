import Dialog from "@mui/material/Dialog";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
} from "@mui/material";
import Button from "@mui/material/Button";
import {
  processPatientBundlesForQDM,
  readImportFile,
} from "../../../../util/FhirImportHelper";
import { useDropzone } from "react-dropzone";
import { Toast } from "@madie/madie-design-system/dist/react";
import "./TestCaseImportDialog.css";
import * as _ from "lodash";
import useTestCaseServiceApi from "../../../../api/useTestCaseServiceApi";
import { ScanValidationDto } from "../../../../api/models/ScanValidationDto";

const TestCaseImportFromBonnieDialogQDM = ({ open, handleClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Math.random().toString(36));
  const [errorMessage, setErrorMessage] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const testCaseService = useRef(useTestCaseServiceApi());

  // Toast utilities
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastMessage("");
    setToastOpen(false);
  };

  const showErrorToast = (message: string) => {
    setToastOpen(true);
    setToastType("danger");
    setToastMessage(message);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setErrorMessage(() => null);
    setFileInputKey(Math.random().toString(36));
    const importFile = acceptedFiles[0];
    let response: ScanValidationDto;
    try {
      response = await testCaseService.current.scanImportFile(importFile);
    } catch (error) {
      showErrorToast(
        "An error occurred while validating the import file. Please try again or reach out to the Help Desk."
      );
      return;
    }
    if (response.valid) {
      setFile(importFile);
      let bonniePatients;
      try {
        bonniePatients = await readImportFile(importFile);
      } catch (error) {
        showErrorToast(
          "An error occurred while processing the import file. Please try to regenerate the file and re-import, or contact the Help Desk."
        );
        return;
      }
      if (bonniePatients && bonniePatients.length > 0) {
        try {
          const testCases = processPatientBundlesForQDM(bonniePatients);
          setTestCases(testCases);
        } catch (error) {
          showErrorToast(
            "An error occurred while processing the patient bundles. Please try to regenerate the file and re-import, or contact the Help Desk."
          );
        }
      } else {
        showErrorToast("No patients were found in the selected import file!");
      }
    } else {
      showErrorToast(response.error.defaultMessage);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "application/json": [".json"],
    },
  });

  const renderFileDrop = () => {
    return (
      <Paper style={{ padding: 20 }}>
        <div
          data-testid="file-drop-div"
          {...getRootProps({ className: "dropzone" })}
        >
          <input
            data-testid="file-drop-input"
            key={fileInputKey}
            {...getInputProps()}
          />
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
        <div data-testid="test-case-preview-header">
          [{testCases?.length | 0}] Test Case
          {testCases?.length === 1 ? "" : "s"} from File: {file.name}
        </div>
        <Divider />
        <div
          data-testid="test-case-preview-list"
          style={{ maxHeight: 450, overflowY: "scroll" }}
        >
          {testCases?.map((tc) => (
            <div key={tc.id}>
              <span>{tc.series}</span>
              <span style={{ width: 20 }}></span>
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
      data-testid="test-case-import-dialog"
      aria-labelledby="responsive-dialog-title"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="responsive-dialog-title">Test Case Import</DialogTitle>
      <DialogContent>
        <DialogContent>
          <Alert severity="warning" style={{ marginBottom: 10 }}>
            Please Note: Expected Values for group populations are not imported
            and must be manually updated!
          </Alert>
          <div data-testid="test-case-import-error-div">
            {errorMessage && <span>{errorMessage}</span>}
          </div>
          <div data-testid="test-case-import-content-div">
            {file ? renderFileContent() : renderFileDrop()}
          </div>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          data-testid="test-case-import-cancel-btn"
          onClick={() => {
            setFile(null);
            setErrorMessage(null);
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
          data-testid="test-case-import-import-btn"
          disabled={_.isNil(testCases) || testCases.length === 0}
        >
          Import
        </Button>
      </DialogActions>

      <Toast
        toastKey="import-tests-toast"
        aria-live="polite"
        toastType={toastType}
        testId="error-toast"
        closeButtonProps={{
          "data-testid": "close-toast-button",
        }}
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={10000}
      />
    </Dialog>
  );
};

export default TestCaseImportFromBonnieDialogQDM;
