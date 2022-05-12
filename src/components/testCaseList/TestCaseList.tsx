import React, { useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import TestCase from "../../models/TestCase";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@madie/madie-components";
import TestCaseComponent from "./TestCase";
import useMeasureServiceApi from "../../api/useMeasureServiceApi";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { TextField } from "@mui/material";
import { format, isValid, parseISO } from "date-fns";
import calculationService from "../../api/CalculationService";
import Measure from "../../models/Measure";
import { ExecutionResult } from "fqm-execution/build/types/Calculator";
import { getFhirMeasurePopulationCode } from "../../util/PopulationsMap";
import useOktaTokens from "../../hooks/useOktaTokens";

const TH = tw.th`p-3 border-b text-left text-sm font-bold uppercase`;
const ErrorAlert = tw.div`bg-red-100 text-red-700 rounded-lg m-1 p-3`;

const TestCaseList = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(null);
  const [error, setError] = useState("");
  const [measure, setMeasure] = useState<Measure>(null);
  const [measurementPeriodStart, setMeasurementPeriodStart] = useState<Date>();
  const [measurementPeriodEnd, setMeasurementPeriodEnd] = useState<Date>();
  const { measureId } = useParams<{ measureId: string }>();
  const testCaseService = useRef(useTestCaseServiceApi());
  const measureService = useRef(useMeasureServiceApi());
  const calculation = useRef(calculationService());
  const { getUserName } = useOktaTokens();
  const userName = getUserName();
  const navigate = useNavigate();
  const [canEdit, setCanEdit] = useState<boolean>(false);

  useEffect(() => {
    measureService.current
      .fetchMeasure(measureId)
      .then((measure) => {
        setMeasure(measure);
        setCanEdit(userName === measure.createdBy);

        if (measure?.measurementPeriodStart)
          setMeasurementPeriodStart(parseISO(measure.measurementPeriodStart));
        if (measure?.measurementPeriodEnd)
          setMeasurementPeriodEnd(parseISO(measure.measurementPeriodEnd));
      })
      .catch((error) => {
        setError(error.message);
      });
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
      });
  }, [measureId, testCaseService]);

  useEffect(() => {
    if (
      measurementPeriodStart &&
      isValid(measurementPeriodStart) &&
      measure?.measurementPeriodStart &&
      measurementPeriodStart !== parseISO(measure?.measurementPeriodStart)
    ) {
      measure.measurementPeriodStart = format(
        measurementPeriodStart,
        "yyyy-MM-dd"
      );
      measureService.current.updateMeasure(measure);
    }
  }, [measure, measurementPeriodStart]);

  useEffect(() => {
    if (
      measurementPeriodEnd &&
      isValid(measurementPeriodEnd) &&
      measure?.measurementPeriodEnd &&
      measurementPeriodEnd !== parseISO(measure?.measurementPeriodEnd)
    ) {
      measure.measurementPeriodEnd = format(measurementPeriodEnd, "yyyy-MM-dd");
      measureService.current.updateMeasure(measure);
    }
  }, [measure, measurementPeriodEnd]);

  const createNewTestCase = () => {
    navigate("create");
  };
  const executeTestCases = () => {
    if (measure && measure.cqlErrors) {
      setError(
        "Cannot execute test cases while errors exist in the measure CQL!"
      );
      return;
    }

    if (testCases) {
      calculation.current
        .calculateTestCases(measure, testCases)
        .then((executionResults: ExecutionResult[]) => {
          testCases.forEach((testCase) => {
            const { populationResults } = executionResults.find(
              (result) => result.patientId === testCase.id
            )?.detailedResults?.[0]; // Since we have only 1 population group

            const populationValues =
              testCase?.groupPopulations?.[0]?.populationValues;

            // executionStatus is set to false if any of the populationResults (calculation result) doesn't match with populationValues (Given from testCase)
            if (populationResults && populationValues) {
              let executionStatus = true;
              populationResults.forEach((populationResult) => {
                if (executionStatus) {
                  const groupPopulation = populationValues.find(
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
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  return (
    <div>
      <div tw="flex flex-col">
        <div tw="py-2">
          {canEdit && (
            <Button
              buttonTitle="New Test Case"
              disabled={false}
              onClick={createNewTestCase}
              data-testid="create-new-test-case-button"
            />
          )}
        </div>
        <div tw="py-2">
          {canEdit && (
            <Button
              buttonTitle="Execute Test Cases"
              disabled={false}
              onClick={executeTestCases}
              data-testid="execute-test-cases-button"
            />
          )}
        </div>
        <div tw="py-2 gap-1">
          <h5>Measurement Period</h5>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              data-testid="measurement-period-start"
              readOnly={true}
              disableOpenPicker={true}
              label="Start"
              inputFormat="MM/dd/yyyy"
              value={measurementPeriodStart}
              onChange={(startDate) => {
                setMeasurementPeriodStart(startDate);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              data-testid="measurement-period-end"
              readOnly={true}
              disableOpenPicker={true}
              label="End"
              inputFormat="MM/dd/yyyy"
              value={measurementPeriodEnd}
              onChange={(endDate) => {
                setMeasurementPeriodEnd(endDate);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
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
                {testCases?.map((testCase) => (
                  <TestCaseComponent
                    testCase={testCase}
                    key={testCase.id}
                    canEdit={canEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseList;
