import React, { useEffect, useRef, useState } from "react";
import {
  checkUserCanEdit,
  measureStore,
  useDocumentTitle,
} from "@madie/madie-util";
import {
  PopulationExpectedValue,
  TestCase,
  Group,
  GroupPopulation,
} from "@madie/madie-models";
import "../qiCore/EditTestCase.scss";
import { Button, Toast } from "@madie/madie-design-system/dist/react";
import qdmCalculationService from "../../../api/QdmCalculationService";
import { Allotment } from "allotment";
import RightPanel from "./RightPanel/RightPanel";
import LeftPanel from "./LeftPanel/LeftPanel";
import EditTestCaseBreadCrumbs from "./EditTestCaseBreadCrumbs";
import { useNavigate, useParams } from "react-router-dom";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";
import "allotment/dist/style.css";
import "./EditTestCase.scss";
import useExecutionContext from "../../routes/qiCore/useExecutionContext";
import { useFormik } from "formik";
import { sanitizeUserInput } from "../../../util/Utils";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import tw, { styled } from "twin.macro";
import "styled-components/macro";
import { getPopulationTypesForScoring } from "../../../util/PopulationsMap";

interface AlertProps {
  status?: "success" | "warning" | "error" | "info" | null;
  message?: any;
}

const Alert = styled.div<AlertProps>(({ status = "default" }) => [
  styles[status],
  tw`rounded-lg p-2 m-2 text-base inline-flex items-center w-11/12`,
]);

const styles = {
  success: tw`bg-green-100 text-green-700`,
  warning: tw`bg-yellow-100 text-yellow-700`,
  error: tw`bg-red-100 text-red-700`,
  default: tw`bg-blue-100 text-blue-700`,
};

export interface EditTestCaseProps {
  errors: Array<string>;
  setErrors: (value: Array<string>) => void;
}

const EditTestCase = (props: EditTestCaseProps) => {
  useDocumentTitle("MADiE Edit Measure Edit Test Case");
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

  const { measureState } = useExecutionContext();
  const [measure] = measureState;
  const { updateMeasure } = measureStore;

  const canEdit = checkUserCanEdit(
    measure?.createdBy,
    measure?.acls,
    measure?.measureMetaData?.draft
  );

  const qdmCalculation = useRef(qdmCalculationService());
  const testCaseService = useRef(useTestCaseServiceApi());

  const navigate = useNavigate();
  const { measureId, id } = useParams();

  const [currentTestCase, setCurrentTestCase] = useState<TestCase>(null);
  const [alert, setAlert] = useState<AlertProps>(null);
  const [groupPopulations, setGroupPopulations] = useState<GroupPopulation[]>(
    []
  );

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      series: "",
      groupPopulations: [],
    } as TestCase,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  const handleSubmit = async (testCase: TestCase) => {
    testCase.title = sanitizeUserInput(testCase.title);
    testCase.description = sanitizeUserInput(testCase.description);
    testCase.series = sanitizeUserInput(testCase.series);

    await updateTestCase(testCase);
  };

  const updateTestCase = async (testCase: TestCase) => {
    try {
      const updatedTestCase = await testCaseService.current.updateTestCase(
        testCase,
        measureId
      );

      resetForm({
        values: _.cloneDeep(updatedTestCase),
      });
      setCurrentTestCase(_.cloneDeep(updatedTestCase));
      updateMeasureStore(updatedTestCase);
      showToast(`Test Case Updated Successfully`, "success");
    } catch (error) {
      props.setErrors([
        ...props.errors,
        "An error occurred while updating the test case.",
      ]);
    }
  };

  function updateMeasureStore(testCase: TestCase) {
    const measureCopy = Object.assign({}, measure);
    // find and remove stale test case from measure
    measureCopy.testCases = measureCopy.testCases?.filter(
      (tc) => tc.id !== testCase.id
    );
    // add updated test to measure
    if (measureCopy.testCases) {
      measureCopy.testCases.push(testCase);
    } else {
      measureCopy.testCases = [testCase];
    }
    // update measure store
    updateMeasure(measureCopy);
  }

  // maps measure.group => testcase.groupPopulation
  // if patient based, then default for expected and actual is false, else null
  const mapMeasureGroupsToTestCaseGroups = (
    measureGroup: Group
  ): GroupPopulation => {
    return {
      groupId: measureGroup.id,
      scoring: measure.scoring,
      populationBasis: String(measure.patientBasis),
      stratificationValues: [],
      populationValues: getPopulationTypesForScoring(measureGroup)?.map(
        (population: PopulationExpectedValue) => ({
          name: population.name,
          expected: measure.patientBasis ? false : null,
          actual: measure.patientBasis ? false : null,
          id: population.id,
          criteriaReference: population.criteriaReference,
        })
      ),
    };
  };

  // todo Unable to create CV measures as observation validations could be incorrect

  // Fetches test case based on ID, identifies measure.group converts it to testcase.groupPopulation
  // if the measure.group is not in TC then a new testcase.groupPopulation is added to nextTc
  // and set it to form
  useEffect(() => {
    if (measureId && id) {
      testCaseService.current
        .getTestCase(id, measureId)
        .then((tc: TestCase) => {
          setCurrentTestCase(tc);
          const nextTc = _.cloneDeep(tc);
          if (measure?.groups) {
            nextTc.groupPopulations = measure.groups?.map((group) => {
              const existingTestCasePC = tc.groupPopulations?.find(
                (gp) => gp.groupId === group.id
              );
              return _.isNil(existingTestCasePC)
                ? mapMeasureGroupsToTestCaseGroups(group)
                : {
                    ...existingTestCasePC,
                  };
            });
          } else {
            nextTc.groupPopulations = [];
          }
          resetForm({ values: _.cloneDeep(nextTc) });
          setGroupPopulations(_.cloneDeep(nextTc.groupPopulations));
        })
        .catch((error) => {
          if (error.toString().includes("404")) {
            navigate("/404");
          }
        });
    }
  }, [measureId, id, measure?.groups, navigate]);

  const calculateQdmTestCases = async () => {
    try {
      const calculationOutput =
        await qdmCalculation.current.calculateQdmTestCases();
      calculationOutput &&
        showToast(
          "Calculation was successful, output is printed in the console",
          "success"
        );
    } catch (error) {
      showToast("Error while calculating QDM test cases", "danger");
    }
  };

  console.log("formik values", formik.values);

  // Todo Rohit Save populations
  // Need back end changes to save populations

  return (
    <>
      <EditTestCaseBreadCrumbs
        testCase={currentTestCase}
        measureId={measureId}
      />
      {alert && (
        <Alert
          status={alert?.status}
          role="alert"
          aria-label="Edit Alert"
          data-testid="edit-test-case-alert"
        >
          {alert?.message}
          <button
            data-testid="close-edit-test-case-alert"
            type="button"
            tw="box-content h-4 p-1 ml-3 mb-1.5"
            data-bs-dismiss="alert"
            aria-label="Close Alert"
            onClick={() => setAlert(null)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </Alert>
      )}
      <form id="edit-test-case-form" onSubmit={formik.handleSubmit}>
        <div className="allotment-wrapper">
          <Allotment defaultSizes={[200, 100]} vertical={false}>
            <Allotment.Pane>
              <LeftPanel />
            </Allotment.Pane>
            <Allotment.Pane>
              <RightPanel
                canEdit={canEdit}
                groupPopulations={groupPopulations}
                errors={formik.errors.groupPopulations}
                onChange={(groupPopulations) => {
                  formik.setFieldValue("groupPopulations", groupPopulations);
                }}
              />
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
            disabled={!canEdit}
          >
            Run Test
          </Button>
          <Button
            variant="cyan"
            type="submit"
            data-testid="edit-test-case-save-button"
            // todo rohit uncomment this before pushing changes
            disabled={!(formik.dirty && formik.isValid) || !canEdit}
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
    </>
  );
};

export default EditTestCase;
