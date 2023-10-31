import React, { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingButton from "@mui/lab/LoadingButton";

interface RunTestButtonProps {
  hasErrors: boolean;
  isExecutionContextReady: boolean;
  onRunTests: () => void;
  shouldDisableRunTestsButton?: boolean;
}

export default function RunTestButton(props: RunTestButtonProps) {
  const {
    hasErrors,
    isExecutionContextReady,
    onRunTests,
    shouldDisableRunTestsButton = false,
  } = props;

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
