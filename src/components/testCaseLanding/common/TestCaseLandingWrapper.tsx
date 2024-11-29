import React, { useState, useEffect } from "react";
import "twin.macro";
import "styled-components/macro";
import { MadieDiscardDialog } from "@madie/madie-design-system/dist/react";
import TestCaseListSideBarNav from "./TestCaseListSideBarNav";
import { measureStore, routeHandlerStore } from "@madie/madie-util";
import { useBlocker } from "react-router";

export interface RouteHandlerState {
  canTravel: boolean;
  pendingRoute: string;
}

const TestCaseLandingWrapper = (props) => {
  const [measure, setMeasure] = useState<any>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Required by every single spa application that has internal routing
  // This will block user from navigating inside madie-measure when the current form is dirty
  const { updateRouteHandlerState } = routeHandlerStore;
  const [routeHandlerState, setRouteHandlerState] = useState<RouteHandlerState>(
    routeHandlerStore.state
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  useEffect(() => {
    const subscription = routeHandlerStore.subscribe(setRouteHandlerState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (
      !routeHandlerState?.canTravel &&
      currentLocation.pathname !== nextLocation.pathname
    ) {
      setDialogOpen(true);
      return true;
    }
    setDialogOpen(false);
    return false;
  });
  const onContinue = () => {
    setDialogOpen(false);
    updateRouteHandlerState({
      canTravel: true,
      pendingRoute: "",
    });
    blocker.proceed();
  };
  const onClose = () => {
    setDialogOpen(false);
    blocker.reset();
  };

  return (
    <div
      tw="grid lg:grid-cols-6 gap-4 mx-8 my-6 shadow-lg rounded-md border border-slate bg-white"
      style={{ marginTop: 16 }}
    >
      <TestCaseListSideBarNav
        allPopulationCriteria={measure?.groups}
        qdm={props.qdm}
      />
      <div tw="lg:col-span-5 pl-2 pr-2">{props.children && props.children}</div>
      <MadieDiscardDialog
        open={dialogOpen}
        onContinue={onContinue}
        onClose={onClose}
      />
    </div>
  );
};

export default TestCaseLandingWrapper;
