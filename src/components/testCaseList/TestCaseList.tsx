import React, { useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import useTestCaseServiceApi from "../../api/useTestCaseServiceApi";
import TestCase from "../../models/TestCase";
import { useParams } from "react-router-dom";
import { Button } from "@madie/madie-components";
import TestCaseComponent from "./TestCase";
import useMeasureServiceApi from "../../api/useMeasureServiceApi";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { TextField } from "@mui/material";
import { isValid } from "date-fns";
import useCalculation from "../../api/useCalculation";

const TH = tw.th`p-3 border-b text-left text-sm font-bold uppercase`;
const ErrorAlert = tw.div`bg-red-100 text-red-700 rounded-lg m-1 p-3`;

const TestCaseList = () => {
  const [testCases, setTestCases] = useState<TestCase[]>();
  const [error, setError] = useState("");
  const [measure, setMeasure] = useState(null);
  const [measurementPeriodStart, setMeasurementPeriodStart] = useState(null);
  const [measurementPeriodEnd, setMeasurementPeriodEnd] = useState(null);
  const { measureId } = useParams<{ measureId: string }>();
  const testCaseService = useRef(useTestCaseServiceApi());
  const measureService = useRef(useMeasureServiceApi());
  const calculation = useRef(useCalculation());

  const [isExecuteButtonClicked, setisExecuteButtonClicked] = useState(false);

  const [activeItem, setActiveItem] = React.useState(null);

  useEffect(() => {
    measureService.current
      .fetchMeasure(measureId)
      .then((measure) => {
        setMeasure(measure);
        setMeasurementPeriodStart(measure.measurementPeriodStart);
        setMeasurementPeriodEnd(measure.measurementPeriodEnd);
      })
      .catch((error) => {
        console.error(
          `Failed to load measure. An error occurred while loading measure with ID [${measureId}]`,
          error
        );
      });
    testCaseService.current
      .getTestCasesByMeasureId(measureId)
      .then((testCaseList: TestCase[]) => {
        //MAT-3911: only for mock up purpose
        const listItems = testCaseList.map((testCase) => {
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
      isValid(measurementPeriodStart) &&
      measure.measurementPeriodStart !== measurementPeriodStart
    ) {
      const updatedMeasure = { ...measure };
      updatedMeasure.measurementPeriodStart = measurementPeriodStart;
      measureService.current.updateMeasure(updatedMeasure);
    }
    if (
      isValid(measurementPeriodEnd) &&
      measure.measurementPeriodEnd !== measurementPeriodEnd
    ) {
      const updatedMeasure = { ...measure };
      updatedMeasure.measurementPeriodEnd = measurementPeriodEnd;
      measureService.current.updateMeasure(updatedMeasure);
    }
  }, [measurementPeriodStart, measurementPeriodEnd]);

  //MAT-3911: the following is pure mockup data, need to be replaced by real data
  const executeTestCasesHandler = () => {
    if (testCases) {
      // calculation.current.calculateTestCases(measure, testCases).then(detailedResults => {
      //   // detailedResults.
      // });
      let count = 0;
      testCases.map((testCase) => {
        if (count === 0) {
          testCase.executionStatus = "pass";
        } else {
          testCase.executionStatus = "fail";
        }
        count = count + 1;
      });
    }
    setisExecuteButtonClicked(true);
  };

  return (
    <div>
      <div tw="flex flex-col">
        <div tw="py-2">
          <Button
            buttonTitle="Execute Test Cases"
            disabled={false}
            onClick={executeTestCasesHandler}
            data-testid="execute-test-case-row"
          />
        </div>
        <div tw="py-2 gap-1">
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              data-testid="measurement-period-start"
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
                  <TH scope="col"></TH>
                  <TH scope="col">Title</TH>
                  <TH scope="col">Series</TH>
                  <TH scope="col">Status</TH>
                  <TH scope="col" />
                </tr>
              </thead>
              <tbody>
                {testCases?.map((testCase) => (
                  <TestCaseComponent testCase={testCase} key={testCase.id} />
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
