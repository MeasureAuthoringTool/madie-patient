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
import { TestCaseImportRequest } from "@madie/madie-models";
import validator from "validator";

const TestCaseImportDialog = ({ dialogOpen, handleClose, onImport }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadingFileSpinner, setUploadingFileSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [testCaseImportRequest, setTestCaseImportRequest] = useState<
    TestCaseImportRequest[]
  >([]);
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

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    removeUploadedFile();
    if (!_.isEmpty(fileRejections)) {
      setErrorMessage(fileRejections[0].errors[0].message);
      return;
    }
    setUploadingFileSpinner(true);
    let response: ScanValidationDto;
    try {
      response = await testCaseService.current.scanImportFile(acceptedFiles);
    } catch (error) {
      setUploadingFileSpinner(false);
      showErrorToast(
        "An error occurred while uploading the file. Please try again or reach out to the helpdesk"
      );
      return;
    }
    if (!response.valid) {
      setUploadingFileSpinner(false);
      showErrorToast(response.error.defaultMessage);
    } else {
      const zip = new JSZip();
      const filesMap = [];
      let fileNames = [];
      const parentFolderName = acceptedFiles[0].name
        .replace(".zip", "")
        .split(" ")[0];
      zip
        .loadAsync(acceptedFiles[0])
        .then((content) => {
          // Filtering out all the fileNames that are valid, based on following format
          // Format => Zip file name followed with a valid UUID followed by json file extension
          // Ex: CMS136FHIR-v0.0.000-FHIR4-TestCases/a648e724-ce72-4cac-b0a7-3c4d52784f73/CMS136FHIR-v0.0.000-tcseries-tctitle001.json
          fileNames = _.filter(
            _.keys(content.files).map((fileName) => {
              // file compressed from MAC has a parentFolderName and also contains several other hidden files
              if (fileName.startsWith(parentFolderName)) {
                const folderNameSplit = fileName.split("/");
                if (
                  validator.isUUID(folderNameSplit[1]) &&
                  fileName.endsWith(".json")
                ) {
                  return fileName;
                }
              } else {
                // Zip downloaded from MADiE doesn't have a parentFolderName
                // Ex: a648e724-ce72-4cac-b0a7-3c4d52784f73/CMS136FHIR-v0.0.000-tcseries-tctitle001.json
                const folderNameSplit = fileName.split("/");
                if (
                  validator.isUUID(folderNameSplit[0]) &&
                  fileName.endsWith(".json")
                ) {
                  return fileName;
                }
              }
            }),
            (v) => !!v
          );
          return Promise.all(
            fileNames.map((filename) => zip.file(filename).async("string"))
          );
        })
        .then((values) => {
          _.forEach(values, (val, i) => {
            let patientId;
            if (fileNames[i].startsWith(parentFolderName)) {
              patientId = _.split(fileNames[i], "/")[1];
            } else {
              patientId = _.split(fileNames[i], "/")[0];
            }

            filesMap.push({
              patientId: patientId,
              json: val,
            });
          });

          if (_.isEmpty(filesMap)) {
            setErrorMessage(
              "Unable to find any valid test case json. Please make sure the format is accurate"
            );
          } else {
            setTestCaseImportRequest(filesMap);
          }
          setUploadedFile(acceptedFiles[0]);
          setUploadingFileSpinner(false);
        })
        .catch(() => {
          setErrorMessage("Error uploading zip file");
        });
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noDrag: false,
    maxFiles: 1,
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
        <div tw="flex items-center justify-between w-full">
          <div tw="flex items-center">
            <FolderZipOutlinedIcon tw="m-4 text-lg" />
            <div tw="ml-1 ">
              <small tw="block">{uploadedFile.name}</small>
              <small tw="block">
                {prettyBytes(uploadedFile.size)} -{" "}
                {errorMessage ? (
                  <span tw="text-red">Failed</span>
                ) : (
                  <span tw="text-green-550">Complete</span>
                )}
              </small>
            </div>
          </div>
          <div tw="mx-2 border-l-2">
            <CloseIcon tw="ml-2" onClick={removeUploadedFile}></CloseIcon>
          </div>
        </div>
      </div>
    );
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setErrorMessage(null);
    setTestCaseImportRequest([]);
  };

  const onClose = () => {
    setUploadingFileSpinner(false);
    setUploadedFile(null);
    setErrorMessage(null);
    setTestCaseImportRequest([]);
    handleClose();
  };

  return (
    <MadieDialog
      title="Test Case Import"
      dialogProps={{
        onClose,
        open: dialogOpen,
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
        disabled: _.isNil(uploadedFile) || !_.isEmpty(errorMessage),
        continueText: "Import",
        onClick: () => onImport(testCaseImportRequest),
      }}
    >
      <small>
        Newly uploaded test cases will replace existing test cases that have
        matching IDs.
      </small>
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
      <div
        tw="flex items-center ml-20"
        data-testid="test-case-import-error-div"
      >
        {errorMessage && <small tw="text-red">{errorMessage}</small>}
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
