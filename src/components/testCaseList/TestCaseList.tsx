import React, { useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import * as _ from "lodash";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import { TestCase } from "@madie/madie-models";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@madie/madie-components";
import TestCaseComponent from "./TestCase";
import useMeasureServiceApi from "../../api/useMeasureServiceApi";
import calculationService from "../../api/CalculationService";

import {
  DetailedPopulationGroupResult,
  ExecutionResult,
} from "fqm-execution/build/types/Calculator";
import { getFhirMeasurePopulationCode } from "../../util/PopulationsMap";
import useOktaTokens from "../../hooks/useOktaTokens";
import useExecutionContext from "../routes/useExecutionContext";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress, Typography } from "@mui/material";
import { processPatientBundles } from "../../util/ImportHelper";
import TestCaseImportDialog from "./TestCaseImportDialog";

const TH = tw.th`p-3 border-b text-left text-sm font-bold uppercase`;
const ErrorAlert = tw.div`bg-red-100 text-red-700 rounded-lg m-1 p-3`;

const TestCaseList = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(null);
  const [executionResults, setExecutionResults] = useState<{
    [key: string]: ExecutionResult<DetailedPopulationGroupResult>;
  }>({});
  const [error, setError] = useState("");
  const { measureId } = useParams<{ measureId: string }>();
  const testCaseService = useRef(useTestCaseServiceApi());
  const measureService = useRef(useMeasureServiceApi());
  const calculation = useRef(calculationService());
  const { getUserName } = useOktaTokens();
  const userName = getUserName();
  const navigate = useNavigate();
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const { measureState, bundleState, valueSetsState } = useExecutionContext();
  const [measure, setMeasure] = measureState;
  const [measureBundle] = bundleState;
  const [valueSets] = valueSetsState;
  const [loadingState, setLoadingState] = useState<any>({
    loading: false,
    message: "",
  });
  const [importDialogState, setImportDialogState] = useState<any>({
    open: false,
  });

  useEffect(() => {
    measureService.current
      .fetchMeasure(measureId)
      .then((measure) => {
        setMeasure(measure);
        setCanEdit(userName === measure.createdBy);
      })
      .catch((error) => {
        setError(error.message);
      });
    refreshTestCases();
  }, [measureId, testCaseService]);

  const refreshTestCases = () => {
    setLoadingState(() => ({
      loading: false,
      message: "Loading Test Cases...",
    }));
    testCaseService.current
      .getTestCasesByMeasureId(measureId)
      .then((testCaseList: TestCase[]) => {
        testCaseList.forEach((testCase) => {
          testCase.executionStatus = "NA";
        });
        setTestCases(testCaseList);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingState({ loading: false, message: "" });
        }, 500);
      });
  };

  const createNewTestCase = () => {
    navigate("create");
  };
  const executeTestCases = async () => {
    if (measure && measure.cqlErrors) {
      setError(
        "Cannot execute test cases while errors exist in the measure CQL!"
      );
      return null;
    }

    if (testCases && measureBundle) {
      try {
        const executionResults: ExecutionResult<DetailedPopulationGroupResult>[] =
          await calculation.current.calculateTestCases(
            measure,
            testCases,
            measureBundle,
            valueSets
          );

        const nextExecutionResults = {};
        testCases.forEach((testCase) => {
          const detailedResults = executionResults.find(
            (result) => result.patientId === testCase.id
          )?.detailedResults;
          nextExecutionResults[testCase.id] = detailedResults;

          const { populationResults } = detailedResults?.[0]; // Since we have only 1 population group

          const populationValues =
            testCase?.groupPopulations?.[0]?.populationValues;

          // executionStatus is set to false if any of the populationResults (calculation result) doesn't match with populationValues (Given from testCase)
          if (populationResults && populationValues) {
            let executionStatus = true;
            populationResults.forEach((populationResult) => {
              if (executionStatus) {
                const groupPopulation: any = populationValues.find(
                  (populationValue) =>
                    getFhirMeasurePopulationCode(populationValue.name) ===
                    populationResult.populationType.toString()
                );

                if (groupPopulation) {
                  groupPopulation.actual = populationResult.result;
                  executionStatus =
                    groupPopulation.expected === populationResult.result;
                }
              }
            });
            testCase.executionStatus = executionStatus ? "pass" : "fail";
          }
        });
        setTestCases([...testCases]);
        setExecutionResults(nextExecutionResults);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const onTestCaseImport = async (testCases: TestCase[]) => {
    setImportDialogState({ ...importDialogState, open: false });

    setLoadingState(() => ({
      loading: true,
      message: "Importing Test Cases...",
    }));

    // TODO: catch errors and display error message if persist fails
    await testCaseService.current.importTestCases(measureId, testCases);

    refreshTestCases();
  };

  return (
    <div>
      <div tw="flex flex-col">
        <div tw="py-2" style={{ display: "flex", flexDirection: "row" }}>
          {canEdit && (
            <Button
              buttonTitle="New Test Case"
              disabled={false}
              onClick={createNewTestCase}
              data-testid="create-new-test-case-button"
            />
          )}
          <span style={{ marginLeft: 5, marginRight: 5 }} />
          {canEdit && (
            <Button
              buttonTitle="Import Test Cases"
              onClick={() => {
                // console.log("Importing the test cases");
                setImportDialogState({ ...importDialogState, open: true });
              }}
              data-testid="show-import-test-cases-button"
            />
          )}
        </div>
        <div tw="py-2">
          {canEdit && (
            <Button
              buttonTitle="Execute Test Cases"
              disabled={
                !!measure?.cqlErrors ||
                _.isNil(measure?.groups) ||
                measure?.groups.length === 0
              }
              onClick={executeTestCases}
              data-testid="execute-test-cases-button"
            />
          )}
        </div>

        {error && (
          <ErrorAlert data-testid="display-tests-error" role="alert">
            {error}
          </ErrorAlert>
        )}
        <div tw="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div tw="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <table tw="min-w-full" data-testid="test-case-tbl">
              <thead>
                <tr>
                  <TH scope="col" />
                  <TH scope="col">Title</TH>
                  <TH scope="col">Series</TH>
                  <TH scope="col">Status</TH>
                  <TH scope="col" />
                </tr>
              </thead>
              <tbody>
                {testCases?.map((testCase) => {
                  return (
                    <TestCaseComponent
                      testCase={testCase}
                      key={testCase.id}
                      canEdit={canEdit}
                      executionResult={executionResults[testCase.id]}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TestCaseImportDialog
        open={importDialogState.open}
        measure={measure}
        onImport={onTestCaseImport}
        handleClose={() =>
          setImportDialogState({ ...importDialogState, open: false })
        }
      />

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
        }}
        open={loadingState.loading}
      >
        <Typography color="inherit">{loadingState.message}</Typography>
        <CircularProgress color="inherit" size={80} />
      </Backdrop>
    </div>
  );
};

export default TestCaseList;
