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
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { IMPORT_ERROR } from "../../qiCore/TestCaseList";

const TestCaseImportDialog = ({ dialogOpen, handleClose, onImport }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadingFileSpinner, setUploadingFileSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [testCaseBundles, setTestCaseBundles] = useState([]);
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
    removeUploadedFile();
    setUploadingFileSpinner(true);
    const zip = new JSZip();
    zip.loadAsync(importedZip[0]).then((content) => {
      Object.keys(content.files).forEach((filename) => {
        try {
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
                setUploadingFileSpinner(false);
                showErrorToast(
                  "An error occurred while uploading the file. Please try again or reach out to the helpdesk"
                );
              }
              if (!response.valid) {
                setUploadingFileSpinner(false);
                showErrorToast(response.error.defaultMessage);
              } else {
                // Todo processing fileContent for any errors https://jira.cms.gov/browse/MAT-5935
                setTestCaseBundles((prevState) => [
                  ...prevState,
                  JSON.parse(fileContent),
                ]);
                setUploadingFileSpinner(false);
                setUploadedFile(importedZip[0]);
              }
            });
        } catch (error) {
          setUploadingFileSpinner(false);
          showErrorToast(
            "An error occurred while uploading the file. Please try again or reach out to the helpdesk"
          );
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

  const renderUploadedFileStatus = () => {
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
          <div tw="absolute right-28 border-l-2">
            <CloseIcon tw="ml-2" onClick={removeUploadedFile}></CloseIcon>
          </div>
        </div>
      </div>
    );
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setErrorMessage(null);
    setTestCaseBundles([]);
  };

  const onClose = () => {
    setUploadingFileSpinner(false);
    setUploadedFile(null);
    setErrorMessage(null);
    setTestCaseBundles([]);
    handleClose();
  };

  return (
    <MadieDialog
      title="Test Case Import"
      dialogProps={{
        onClose,
        open: dialogOpen,
        onSubmit: onImport(testCaseBundles),
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
        {uploadedFile && renderUploadedFileStatus()}
        {uploadingFileSpinner && (
          <div
            tw="flex border border-l-4 mt-5 mx-16 mb-1"
            data-testid="test-case-preview-header"
          >
            <div tw="flex items-center ml-80 my-4">
              <CircularProgress size={32} />
            </div>
          </div>
        )}
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
