import React, { useCallback, useRef, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import {
  Button,
  Toast,
  MadieDialog,
} from "@madie/madie-design-system/dist/react";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import { useDropzone } from "react-dropzone";
import "./TestCaseImportDialog.css";
import * as _ from "lodash";
import useTestCaseServiceApi from "../../../../api/useTestCaseServiceApi";
import { ScanValidationDto } from "../../../../api/models/ScanValidationDto";
import JSZip from "jszip";
import prettyBytes from "pretty-bytes";

const TestCaseImportDialog = ({ dialogOpen, handleClose, onImport }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
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

  const onDrop = useCallback(async (importedZip) => {
    setErrorMessage(() => null);
    const zip = new JSZip();
    zip.loadAsync(importedZip[0]).then((content) => {
      Object.keys(content.files).forEach((filename) => {
        if (filename !== "README.txt") {
          zip
            .file(filename)
            .async("string")
            .then(async (fileContent) => {
              let response: ScanValidationDto;
              try {
                response = await testCaseService.current.scanImportFile(
                  fileContent
                );
              } catch (error) {
                showErrorToast(
                  "An error occurred while validating the import file. Please try again or reach out to the Help Desk."
                );
              }
              if (response.valid) {
                setUploadedFile(importedZip[0]);
                // process fileContent and setTestCases
              } else {
                showErrorToast(response.error.defaultMessage);
              }
            });
        }
      });
    });
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    multiple: false,
    accept: {
      "application/zip": [".zip"],
    },
  });

  const renderFileContent = () => {
    return (
      <div
        tw="flex border border-l-4 mt-5 mx-16 mb-1"
        data-testid="test-case-preview-header"
      >
        <div tw="flex items-center">
          <FolderZipOutlinedIcon tw="m-4 text-lg" />
          <div tw="ml-1 ">
            <small tw="block">{uploadedFile.name}</small>
            <small tw="block">
              {prettyBytes(uploadedFile.size)} -{" "}
              <span tw="text-green-550">Complete</span>
            </small>
          </div>
        </div>
      </div>
    );
  };

  const onClose = () => {
    setUploadedFile(null);
    setErrorMessage(null);
    setTestCases([]);
    handleClose();
  };

  return (
    <MadieDialog
      title="Test Case Import"
      dialogProps={{
        onClose,
        open: dialogOpen,
        onSubmit: onImport(testCases),
        maxWidth: "md",
        fullWidth: true,
      }}
      cancelButtonProps={{
        variant: "secondary",
        cancelText: "Cancel",
        "data-testid": "test-case-import-cancel-btn",
      }}
      continueButtonProps={{
        variant: "cyan",
        type: "submit",
        "data-testid": "test-case-import-import-btn",
        disabled: _.isNil(uploadedFile),
        continueText: "Import",
      }}
    >
      <small>
        Newly uploaded test cases will replace existing test cases that have
        matching IDs.
      </small>
      <div data-testid="test-case-import-error-div">
        {errorMessage && <span>{errorMessage}</span>}
      </div>
      <div data-testid="test-case-import-content-div">
        <div
          data-testid="file-drop-div"
          {...getRootProps({ className: "dropzone" })}
        >
          <input data-testid="file-drop-input" {...getInputProps()} />
          <span tw="text-black">Drag 'n' drop file to upload </span>
          <span tw="pb-3"> or </span>
          <Button
            variant="outline-filled"
            data-testid="select-file-button"
            onClick={open}
          >
            Select File
          </Button>
          <span tw="pt-3">(.zip)</span>
        </div>
        {uploadedFile && renderFileContent()}
      </div>
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
    </MadieDialog>
  );
};

export default TestCaseImportDialog;
