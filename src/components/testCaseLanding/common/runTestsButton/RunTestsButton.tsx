import React, { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Measure,
  Group,
  MeasureObservation,
  Stratification,
  Model,
} from "@madie/madie-models";
import { useFeatureFlags } from "@madie/madie-util";

interface RunTestButtonProps {
  hasErrors: boolean;
  isExecutionContextReady: boolean;
  onRunTests: () => void;
  measure: Measure;
}

export default function RunTestButton(props: RunTestButtonProps) {
  const { hasErrors, isExecutionContextReady, onRunTests, measure } = props;
  const featureFlags = useFeatureFlags();
  const [shouldDisableRunTestsButton, setShouldDisableRunTestsButton] =
    useState(false);
  //TODO: because calculation is a heavy process, react blocks all the re-renders
  // during test case execution. this is to overcome that.
  // remove this once we move calculation to backend
  const [loading, setLoading] = useState(false);
  function runTestCases() {
    setLoading(true);
    setTimeout(async () => {
      await onRunTests();
      setLoading(false);
    }, 500);
  }

  useEffect(() => {
    if (
      measure?.model === Model.QDM_5_6 &&
      featureFlags?.disableRunTestCaseWithObservStrat
    ) {
      const groups: Group[] = measure?.groups;
      groups?.forEach((group) => {
        const measureObservations: MeasureObservation[] =
          group?.measureObservations;
        const measureStratifications: Stratification[] = group?.stratifications;
        if (
          (measureObservations && measureObservations.length > 0) ||
          (measureStratifications && measureStratifications.length > 0)
        ) {
          setShouldDisableRunTestsButton(true);
        }
      });
    }
  }, [measure, measure?.groups]);

  return (
    <LoadingButton
      sx={{
        textTransform: "none",
        color: "white",
      }}
      variant="outlined"
      size="large"
      disabled={hasErrors || shouldDisableRunTestsButton}
      loading={(!hasErrors && !isExecutionContextReady) || loading}
      loadingPosition="start"
      startIcon={<RefreshIcon />}
      onClick={runTestCases}
      data-testid="execute-test-cases-button"
      classes={{ root: "qpp-c-button qpp-c-button--cyan" }}
    >
      Run Test(s)
    </LoadingButton>
  );
}
