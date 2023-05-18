import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  useDocumentTitle,
  measureStore,
  checkUserCanEdit,
} from "@madie/madie-util";
import { TestCase } from "@madie/madie-models";
import "../qiCore/EditTestCase.scss";
import { Button, Toast } from "@madie/madie-design-system/dist/react";
import qdmCalculationService from "../../../api/QdmCalculationService";
import { Allotment } from "allotment";
import RightPanel from "./RightPanel/RightPanel";
import LeftPanel from "./LeftPanel/LeftPanel";
import EditTestCaseBreadCrumbs from "./EditTestCaseBreadCrumbs";
import { useParams } from "react-router-dom";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";
import "allotment/dist/style.css";
import "./EditTestCase.scss";
import tw from "twin.macro";

const TestCaseForm = tw.form`m-3`;

const EditTestCase = () => {
  useDocumentTitle("MADiE Edit Measure Edit Test Case");
  const qdmCalculation = useRef(qdmCalculationService());
  const [measure, setMeasure] = useState<any>(measureStore.state);

  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const canEdit = checkUserCanEdit(
    measure?.createdBy,
    measure?.acls,
    measure?.measureMetaData?.draft
  );

  // Toast utilities
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastMessage("");
    setToastOpen(false);
  };
  const showToast = (
    message: string,
    toastType: "success" | "danger" | "warning"
  ) => {
    setToastOpen(true);
    setToastType(toastType);
    setToastMessage(message);
  };

  const testCaseService = useRef(useTestCaseServiceApi());
  const [currentTestCase, setCurrentTestCase] = useState<TestCase>(null);
  const { measureId, id } = useParams();
  const [testCaseJson, setTestCaseJson] = useState<string>(null);

  const retrieveTestCase = useCallback(() => {
    testCaseService.current.getTestCase(id, measureId).then((tc: TestCase) => {
      setCurrentTestCase(tc);
      setTestCaseJson(tc.json);
    });
  }, [measureId, id, testCaseService]);
  useEffect(() => {
    if (measureId && id) {
      retrieveTestCase();
    }
  }, [testCaseService, measureId, id]);
  const calculateQdmTestCases = () => {
    try {
      const calculationResult = qdmCalculation.current.calculateQdmTestCases();
      calculationResult &&
        showToast(
          "Calculation was successful, output is printed in the console",
          "success"
        );
    } catch (error) {
      showToast("Error while calculating QDM test cases", "danger");
    }
  };

  const submitForm = () => {
    const submitTestCase = {
      ...currentTestCase,
      json: testCaseJson,
    };

    testCaseService.current
      .updateTestCase(submitTestCase, measureId)
      .then(() => {
        showToast(`Test Case Saved Successfully`, "success");
      })
      .catch(() => {
        const message = `Error updating Test Case "${measure.measureName}"`;
        showToast(message, "danger");
      });
  };

  return (
    <TestCaseForm>
      <EditTestCaseBreadCrumbs
        testCase={currentTestCase}
        measureId={measureId}
      />
      <form id="edit-test-case-qdm">
        <div className="allotment-wrapper">
          <Allotment
            defaultSizes={[200, 100]}
            // proportionalLayout={true}
            separator={true}
            vertical={false}
          >
            <Allotment.Pane>
              <LeftPanel
                currentTestCase={currentTestCase}
                setTestCaseJson={setTestCaseJson}
                canEdit={canEdit}
              />
            </Allotment.Pane>
            <Allotment.Pane>
              <RightPanel />
            </Allotment.Pane>
          </Allotment>
        </div>

        <div className="bottom-row">
          {/* shows up in some mockups. leaving for later */}
          {/* <Button variant="outline-filled">Import</Button> */}
          <div className="spacer" />
          <Button
            variant="primary"
            data-testid="qdm-test-case-run-button"
            onClick={calculateQdmTestCases}
          >
            Run Test
          </Button>
          <Button
            variant="cyan"
            onClick={() => {
              submitForm();
            }}
          >
            Save
          </Button>
          <Button variant="outline-filled">
            {/* variant="outline-filled" */}
            Discard Changes
          </Button>
        </div>
        {/* outside flow of page */}
        <Toast
          toastKey="edit-action-toast"
          aria-live="polite"
          toastType={toastType}
          testId={toastType === "danger" ? "error-toast" : "success-toast"}
          closeButtonProps={{
            "data-testid": "close-toast-button",
          }}
          open={toastOpen}
          message={toastMessage}
          onClose={onToastClose}
          autoHideDuration={10000}
        />
      </form>
    </TestCaseForm>
  );
};

export default EditTestCase;
