import React, { useEffect, useRef, useState } from "react";
import {
  useDocumentTitle,
  measureStore,
  checkUserCanEdit,
  routeHandlerStore,
  useFeatureFlags,
} from "@madie/madie-util";
import {
  TestCase,
  MeasureErrorType,
  Group,
  MeasureObservation,
  Stratification,
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
import EditTestCaseBreadCrumbs from "../EditTestCaseBreadCrumbs";
import { useNavigate, useParams } from "react-router-dom";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";
import { useFormik, FormikProvider } from "formik";
import { QDMPatientSchemaValidator } from "./QDMPatientSchemaValidator";

import "allotment/dist/style.css";
import "./EditTestCase.scss";
import {
  MadieError,
  sanitizeUserInput,
  disableRunTestButtonText,
} from "../../../util/Utils";
import * as _ from "lodash";
import "styled-components/macro";
import {
  triggerPopChanges,
  mapExistingTestCasePopulations,
} from "../../../util/PopulationsMap";
import { QDMPatient, DataElement } from "cqm-models";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useQdmExecutionContext } from "../../routes/qdm/QdmExecutionContext";
import StatusHandler from "../../statusHandler/StatusHandler";
import {
  buildHighlightingForGroups,
  GroupCoverageResult,
} from "../../../util/cqlCoverageBuilder/CqlCoverageBuilder";

const EditTestCase = () => {
  useDocumentTitle("MADiE Edit Measure Edit Test Case");
  /* For formik, we could simplify our patterns in some places

  Establish a single source of truth and preserve it in state
  Initialize a formik object that references the properties that we would change on that object. Initialize with formik.enableReinitialize = true;
  Only modify the formik.values, and not the source of truth.
  Do not use any useEffects to update any form state
  Update the source of truth only on successful requests */
  const [measure, setMeasure] = useState<any>(measureStore.state);
  const { updateMeasure } = measureStore;
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
  const [isTestCaseExecuted, setIsTestCaseExecuted] = useState<boolean>(false);

  // our truth, currentTestCase is what we have in DB
  const [currentTestCase, setCurrentTestCase] = useState<TestCase>(null);
  const [qdmPatient, setQdmPatient] = useState<QDMPatient>(); // our truth reference for birthDay only
  // This should be the parsed tc.json initialized class
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [qdmExecutionErrors, setQdmExecutionErrors] = useState<Array<string>>(
    []
  );
  const [selectedDataElement, setSelectedDataElement] = useState<DataElement>();
  const [groupCoverageResult, setGroupCoverageResult] =
    useState<GroupCoverageResult>();

  dayjs.extend(utc);
  dayjs.utc().format(); // utc format

  const featureFlags = useFeatureFlags();
  const [hasObservationOrStratification, setHasObservationOrStratification] =
    useState(false);
  useEffect(() => {
    if (featureFlags?.disableRunTestCaseWithObservStrat) {
      const groups: Group[] = measure?.groups;
      groups?.forEach((group) => {
        const measureObservations: MeasureObservation[] =
          group?.measureObservations;
        const measureStratifications: Stratification[] = group?.stratifications;
        if (
          (measureObservations && measureObservations.length > 0) ||
          (measureStratifications && measureStratifications.length > 0)
        ) {
          setHasObservationOrStratification(true);
        }
      });
    }
  }, [measure, measure?.groups]);
  const formik = useFormik({
    initialValues: {
      title: currentTestCase?.title || "",
      description: currentTestCase?.description || "",
      series: currentTestCase?.series || "",
      json: currentTestCase?.json || "",
      groupPopulations: currentTestCase?.groupPopulations || [],
      birthDate: qdmPatient?.birthDatetime
        ? dayjs(qdmPatient?.birthDatetime)
        : null,
    },
    enableReinitialize: true,
    validationSchema: QDMPatientSchemaValidator,
    onSubmit: async (values: any) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  // Fetches test case based on ID, identifies measure.group converts it to testcase.groupPopulation
  // if the measure.group is not in TC then a new testcase.groupPopulation is added to nextTc
  // and set it to form
  useEffect(() => {
    if (measure && measureId && id) {
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
                ? qdmCalculation.current.mapMeasureGroup(measure, group)
                : mapExistingTestCasePopulations(existingTestCasePC, group);
            });
          } else {
            nextTc.groupPopulations = [];
          }
          let patient: QDMPatient = new QDMPatient();
          if (nextTc?.json) {
            patient = new QDMPatient(JSON.parse(tc?.json));
          }
          nextTc.json = JSON.stringify(patient);
          setQdmPatient(patient);
          setCurrentTestCase(nextTc);
        })
        .catch((error) => {
          if (error.toString().includes("404")) {
            navigate("/404");
          }
        });
    }
  }, [measureId, id, measure?.groups, navigate]);

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
    const modifiedTestCase = { ...currentTestCase, ...testCase };
    try {
      const updatedTestCase = await testCaseService.current.updateTestCase(
        modifiedTestCase,
        measureId
      );
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
    updateMeasure(measureCopy);
  }

  const calculateQdmTestCases = async () => {
    setExecuting(true);
    try {
      const patient = JSON.parse(formik.values?.json);
      const patients: any[] = [patient];
      const calculationOutput =
        await qdmCalculation.current.calculateQdmTestCases(
          cqmMeasure,
          patients
        );
      const patientResults = calculationOutput[patient._id];
      const testCaseWithResults = qdmCalculation.current.processTestCaseResults(
        { ...formik.values },
        measure.groups,
        measure,
        patientResults
      );
      // From processTestCaseResults we will be losing information about updatedTestCase.executionStatus,
      // but that is not required on Edit TestCase page at-least for now.
      formik.setFieldValue(
        "groupPopulations",
        testCaseWithResults.groupPopulations
      );
      const coverageResults = buildHighlightingForGroups(
        patientResults,
        cqmMeasure
      );
      setGroupCoverageResult(coverageResults);
      setIsTestCaseExecuted(true);
    } catch (error) {
      setQdmExecutionErrors((prevState) => [...prevState, `${error.message}`]);
      showToast("Error while calculating QDM test cases", "danger");
      console.error("Error while calculating QDM test cases:", error);
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
    setSelectedDataElement(null);
    setDiscardDialogOpen(false);
  };

  const [testCaseErrors, setTestCaseErrors] = useState(null);

  const handleTestCaseErrors = (value) => {
    setTestCaseErrors(value);
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
      {!_.isNull(testCaseErrors) && (
        <StatusHandler
          error={true}
          errorMessages={[testCaseErrors]}
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
            <Allotment defaultSizes={[175, 125]} vertical={false}>
              <Allotment.Pane>
                <LeftPanel
                  canEdit={canEdit}
                  handleTestCaseErrors={handleTestCaseErrors}
                  selectedDataElement={selectedDataElement}
                  setSelectedDataElement={setSelectedDataElement}
                />
              </Allotment.Pane>
              <Allotment.Pane>
                <RightPanel
                  canEdit={canEdit}
                  testCaseGroups={formik?.values?.groupPopulations}
                  isTestCaseExecuted={isTestCaseExecuted}
                  errors={formik.errors.groupPopulations}
                  groupCoverageResult={groupCoverageResult}
                  calculationErrors={qdmExecutionErrors}
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
                    const nextGc = _.cloneDeep(updatedPops);
                    // only update the formState. Not the source of truth.
                    formik.setFieldValue("groupPopulations", nextGc);
                  }}
                  measureGroups={measure?.groups}
                  measureName={measure?.measureName}
                  measureCql={measure?.cql}
                  cqlErrors={measure?.cqlErrors}
                  includeSDE={measure?.testCaseConfiguration?.sdeIncluded}
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
                !formik.values?.json ||
                !executionContextReady ||
                executing ||
                hasObservationOrStratification
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
              Discard Changes
            </Button>
          </div>
          {hasObservationOrStratification && (
            <div
              style={{
                textAlign: "center",
                color: "#717171",
                fontSize: "14px",
                paddingBottom: "30px",
              }}
            >
              {disableRunTestButtonText}
            </div>
          )}
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
