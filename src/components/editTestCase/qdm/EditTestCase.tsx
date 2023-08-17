import React, { useEffect, useRef, useState } from "react";
import {
  useDocumentTitle,
  measureStore,
  checkUserCanEdit,
  routeHandlerStore,
} from "@madie/madie-util";
import {
  TestCase,
  PopulationExpectedValue,
  Group,
  GroupPopulation,
  MeasureErrorType,
} from "@madie/madie-models";
import "../qiCore/EditTestCase.scss";
import {
  Button,
  Toast,
  MadieDiscardDialog,
} from "@madie/madie-design-system/dist/react";
import qdmCalculationService from "../../../api/QdmCalculationService";
import { Allotment } from "allotment";
import RightPanel from "./RightPanel/RightPanel";
import LeftPanel from "./LeftPanel/LeftPanel";
import EditTestCaseBreadCrumbs from "./EditTestCaseBreadCrumbs";
import { useNavigate, useParams } from "react-router-dom";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";
import { useFormik, FormikProvider } from "formik";
import { QDMPatientSchemaValidator } from "./QDMPatientSchemaValidator";

import "allotment/dist/style.css";
import "./EditTestCase.scss";
import { MadieError, sanitizeUserInput } from "../../../util/Utils";
import * as _ from "lodash";
import "styled-components/macro";
import {
  getPopulationTypesForScoring,
  triggerPopChanges,
} from "../../../util/PopulationsMap";
import { QDMPatient } from "cqm-models";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";
import StatusHandler from "../../statusHandler/StatusHandler";
import { JSONPath } from "jsonpath-plus";

enum PopulationType {
  IPP = "initialPopulation",
  DENOM = "denominator",
  DENEX = "denominator-exclusion",
  DENEXCEP = "denominator-exception",
  NUMER = "numerator",
  NUMEX = "numerator-exclusion",
  MSRPOPL = "measure-population",
  MSRPOPLEX = "measure-population-exclusion",
  OBSERV = "measure-observation",
}

const EditTestCase = () => {
  useDocumentTitle("MADiE Edit Measure Edit Test Case");

  const [measure, setMeasure] = useState<any>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const canEdit = checkUserCanEdit(
    measure?.measureSet?.owner,
    measure?.measureSet?.acls,
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

  const qdmCalculation = useRef(qdmCalculationService());
  const testCaseService = useRef(useTestCaseServiceApi());

  const { cqmMeasureState, executionContextReady, executing, setExecuting } =
    useQdmExecutionContext();

  const [cqmMeasure] = cqmMeasureState;

  const navigate = useNavigate();
  const { measureId, id } = useParams();
  const [executionRun, setExecutionRun] = useState<boolean>(false);

  const [currentTestCase, setCurrentTestCase] = useState<TestCase>(null);
  const [qdmPatient, setQdmPatient] = useState<QDMPatient>();
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [qdmExecutionErrors, setQdmExecutionErrors] = useState<Array<string>>(
    []
  );

  dayjs.extend(utc);
  dayjs.utc().format(); // utc format

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      series: "",
      json: "",
      groupPopulations: [],
      birthDate: qdmPatient?.birthDatetime
        ? dayjs(qdmPatient?.birthDatetime)
        : "",
    },
    validationSchema: QDMPatientSchemaValidator,
    onSubmit: async (values: any) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  const handleSubmit = async (testCase: TestCase) => {
    testCase.title = sanitizeUserInput(testCase.title);
    testCase.description = sanitizeUserInput(testCase.description);
    testCase.series = sanitizeUserInput(testCase.series);

    if (formik.values?.json) {
      testCase.json = formik.values?.json;
      const patient: QDMPatient = JSON.parse(formik.values.json);
      if (patient) {
        setQdmPatient(patient);
        formik.setFieldValue(
          "birthDate",
          patient?.birthDatetime ? dayjs(patient?.birthDatetime) : null
        );
      }
    }

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
      showToast("Test Case Updated Successfully", "success");
    } catch (error) {
      if (error instanceof MadieError) {
        showToast(
          `Error updating Test Case "${measure.measureName}": ${error.message}`,
          "danger"
        );
        return;
      }
      showToast(`Error updating Test Case "${measure.measureName}"`, "danger");
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
    setMeasure(measureCopy);
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

  // Fetches test case based on ID, identifies measure.group converts it to testcase.groupPopulation
  // if the measure.group is not in TC then a new testcase.groupPopulation is added to nextTc
  // and set it to form
  useEffect(() => {
    if (measureId && id) {
      testCaseService.current
        .getTestCase(id, measureId)
        .then((tc: TestCase) => {
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
          setCurrentTestCase(nextTc);
          let patient: QDMPatient = null;
          if (nextTc?.json) {
            patient = JSON.parse(tc?.json);
            if (patient) {
              setQdmPatient(patient);
              formik.setFieldValue(
                "birthDate",
                patient?.birthDatetime ? dayjs(patient?.birthDatetime) : null
              );
            }
          }
          formik.resetForm({ values: _.cloneDeep(nextTc) });
        })
        .catch((error) => {
          if (error.toString().includes("404")) {
            navigate("/404");
          }
        });
    }
  }, [measureId, id, measure?.groups, navigate]);

  const calculateQdmTestCases = async () => {
    setExecuting(true);
    try {
      const calculationOutput =
        await qdmCalculation.current.calculateQdmTestCases(
          cqmMeasure,
          JSON.parse(currentTestCase?.json)
        );

      //find the population_sets
      const populationSets = JSONPath({
        path: "$.population_sets[*].population_set_id",
        json: cqmMeasure,
      });

      populationSets.forEach((pop) => {
        const results = JSONPath({
          path: `$..${pop}`,
          json: calculationOutput,
        });
        let populationMap = new Map<String, number>();
        let groupsMap = new Map<String, Map<String, number>>();

        Object.entries(PopulationType).forEach((value, key) => {
          //value is one of IPP, DENOM, NUMER, etc...
          //Set's an entry = IPP & numeric value from results
          populationMap.set(value[1], eval(`results[0].${value[0]}`));
        });

        groupsMap.set("" + pop, populationMap);

        currentTestCase.groupPopulations.forEach((value) => {
          if (value.groupId === pop) {
            value.populationValues.forEach((population) => {
              //Look up population
              population.actual = groupsMap.get(pop).get(population.name);
            });
          }
        });
      });

      calculationOutput &&
        showToast(
          "Calculation was successful, output is printed in the console",
          "success"
        );
      setExecutionRun(true);
    } catch (error) {
      setQdmExecutionErrors((prevState) => [...prevState, `${error.message}`]);
      showToast("Error while calculating QDM test cases", "danger");
    } finally {
      setExecuting(false);
    }
  };

  const { updateRouteHandlerState } = routeHandlerStore;
  useEffect(() => {
    updateRouteHandlerState({
      canTravel: !formik.dirty,
      pendingRoute: "",
    });
  }, [formik.dirty, currentTestCase?.json]);

  const discardChanges = () => {
    resetForm();
    setDiscardDialogOpen(false);
  };

  return (
    <>
      {qdmExecutionErrors && qdmExecutionErrors.length > 0 && (
        <StatusHandler
          error={true}
          errorMessages={qdmExecutionErrors}
          testDataId="test_case_execution_errors"
        />
      )}
      <FormikProvider value={formik}>
        <EditTestCaseBreadCrumbs
          testCase={currentTestCase}
          measureId={measureId}
        />

        <form id="edit-test-case-form" onSubmit={formik.handleSubmit}>
          <div className="allotment-wrapper">
            <Allotment defaultSizes={[200, 100]} vertical={false}>
              <Allotment.Pane>
                <LeftPanel canEdit={canEdit} />
              </Allotment.Pane>
              <Allotment.Pane>
                <RightPanel
                  canEdit={canEdit}
                  groupPopulations={currentTestCase?.groupPopulations}
                  executionRun={executionRun}
                  errors={formik.errors.groupPopulations}
                  onChange={(
                    groupPopulations,
                    changedGroupId,
                    changedPopulation
                  ) => {
                    const updatedPops = triggerPopChanges(
                      groupPopulations,
                      changedGroupId,
                      changedPopulation,
                      measure?.groups
                    );
                    setCurrentTestCase((prevCurrentTestCase) => ({
                      ...prevCurrentTestCase,
                      groupPopulations: updatedPops,
                    }));
                    formik.setFieldValue("groupPopulations", updatedPops);
                    formik.setFieldValue(
                      "birthDate",
                      formik.values?.birthDate
                        ? formik.values?.birthDate
                        : qdmPatient?.birthDatetime
                        ? dayjs(qdmPatient?.birthDatetime)
                        : null
                    );
                  }}
                  measureName={measure?.measureName}
                  birthDateTime={
                    formik.values?.birthDate
                      ? formik.values?.birthDate
                      : qdmPatient?.birthDatetime
                      ? dayjs(qdmPatient?.birthDatetime)
                      : null
                  }
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
              disabled={
                !!measure?.cqlErrors ||
                _.isEmpty(measure?.groups) ||
                measure?.errors?.includes(
                  MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES
                ) ||
                !executionContextReady ||
                executing
              }
            >
              Run Test
            </Button>
            <Button
              variant="cyan"
              type="submit"
              data-testid="edit-test-case-save-button"
              disabled={!(formik.dirty && formik.isValid) || !canEdit}
            >
              Save
            </Button>
            <Button
              variant="outline-filled"
              disabled={!formik.dirty || !canEdit}
              onClick={() => setDiscardDialogOpen(true)}
            >
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
      </FormikProvider>
      <MadieDiscardDialog
        open={discardDialogOpen}
        onClose={() => setDiscardDialogOpen(false)}
        onContinue={discardChanges}
      />
    </>
  );
};

export default EditTestCase;
