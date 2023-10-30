import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Timing from "./Timing";
import {
  AssessmentPerformed,
  Symptom,
  Participation,
  DiagnosticStudyPerformed,
} from "cqm-models";

const updateDataElement = jest.fn();

describe("Timing", () => {
  it("should not render any timing when selected DataElement is null", () => {
    render(
      <Timing
        onChange={updateDataElement}
        selectedDataElement={null}
        canEdit={true}
      />
    );

    expect(
      screen.queryByText("Relevant Period - Start")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Relevant Period - End")).not.toBeInTheDocument();
    expect(screen.queryByText("Relevant Date/Time")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Prevalence Period - Start")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Prevalence Period - End")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Participation Period - Start")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Participation Period - End")
    ).not.toBeInTheDocument();

    expect(screen.queryByText("Author Date/Time")).not.toBeInTheDocument();
    expect(screen.queryByText("Result Date/Time")).not.toBeInTheDocument();
  });

  it("should render timing for AssessmentPerformed DataElement", () => {
    const assessmentPerformedElement: AssessmentPerformed =
      new AssessmentPerformed();

    render(
      <Timing
        onChange={updateDataElement}
        selectedDataElement={assessmentPerformedElement}
        canEdit={true}
      />
    );

    expect(screen.getByTestId("relevant-period-start")).toBeInTheDocument();
    expect(screen.getByTestId("relevant-period-end")).toBeInTheDocument();
    expect(screen.queryByText("Relevant Period - Start")).toBeInTheDocument();
    expect(screen.queryByText("Relevant Period - End")).toBeInTheDocument();
    expect(screen.getByTestId("relevant-datetime")).toBeInTheDocument();
    expect(screen.queryByText("Relevant Datetime")).toBeInTheDocument();

    expect(screen.getByTestId("author-datetime")).toBeInTheDocument();
    expect(screen.queryByText("Author Datetime")).toBeInTheDocument();
  });

  it("should render prevalencePeriod for Symptom DataElement", () => {
    const symptomDataElement: Symptom = new Symptom();

    render(
      <Timing
        onChange={updateDataElement}
        selectedDataElement={symptomDataElement}
        canEdit={true}
      />
    );

    expect(screen.getByTestId("prevalence-period-start")).toBeInTheDocument();
    expect(screen.getByTestId("prevalence-period-end")).toBeInTheDocument();
    expect(screen.getByText("Prevalence Period - Start")).toBeInTheDocument();
    expect(screen.getByText("Prevalence Period - End")).toBeInTheDocument();
  });

  it("should render participationPeriod for Participation DataElement", () => {
    const participationDataElement: Participation = new Participation();

    render(
      <Timing
        onChange={updateDataElement}
        selectedDataElement={participationDataElement}
        canEdit={true}
      />
    );

    expect(
      screen.getByTestId("participation-period-start")
    ).toBeInTheDocument();
    expect(screen.getByTestId("participation-period-end")).toBeInTheDocument();
    expect(
      screen.getByText("Participation Period - Start")
    ).toBeInTheDocument();
    expect(screen.getByText("Participation Period - End")).toBeInTheDocument();
  });

  it("should render resultDatetime for DiagnosticStudyPerformed DataElement", () => {
    const diagnosticDataElement: DiagnosticStudyPerformed =
      new DiagnosticStudyPerformed();

    render(
      <Timing
        onChange={updateDataElement}
        selectedDataElement={diagnosticDataElement}
        canEdit={true}
      />
    );

    expect(screen.getByTestId("relevant-period-start")).toBeInTheDocument();
    expect(screen.getByTestId("relevant-period-end")).toBeInTheDocument();
    expect(screen.queryByText("Relevant Period - Start")).toBeInTheDocument();
    expect(screen.queryByText("Relevant Period - End")).toBeInTheDocument();

    expect(screen.getByTestId("relevant-datetime")).toBeInTheDocument();
    expect(screen.queryByText("Relevant Datetime")).toBeInTheDocument();
    expect(screen.getByTestId("author-datetime")).toBeInTheDocument();
    expect(screen.queryByText("Author Datetime")).toBeInTheDocument();

    expect(screen.getByTestId("result-datetime")).toBeInTheDocument();
    expect(screen.queryByText("Result Datetime")).toBeInTheDocument();
  });

  it("should handle prevalencePeriod change for Symptom DataElement", () => {
    const symptomDataElement: Symptom = new Symptom();

    render(
      <Timing
        onChange={updateDataElement}
        selectedDataElement={symptomDataElement}
        canEdit={true}
      />
    );

    expect(screen.getByTestId("prevalence-period-start")).toBeInTheDocument();
    expect(screen.getByTestId("prevalence-period-end")).toBeInTheDocument();
    expect(screen.getByText("Prevalence Period - Start")).toBeInTheDocument();
    expect(screen.getByText("Prevalence Period - End")).toBeInTheDocument();

    const inputs = screen.getAllByPlaceholderText(
      "MM/DD/YYYY hh:mm aa"
    ) as HTMLInputElement[];
    expect(inputs.length).toBe(2);

    //change Prevalence Period - Start
    fireEvent.change(inputs[0], { target: { value: "08/02/2023 07:49 AM" } });
    expect(inputs[0].value).toBe("08/02/2023 07:49 AM");

    //change Prevalence Period - End
    fireEvent.change(inputs[1], { target: { value: "08/03/2023 07:58 AM" } });
    expect(inputs[1].value).toBe("08/03/2023 07:58 AM");
  });

  it("should handle participationPeriod change for Participation DataElement", () => {
    const participationDataElement: Participation = new Participation();

    render(
      <Timing
        selectedDataElement={participationDataElement}
        onChange={updateDataElement}
        canEdit={true}
      />
    );

    expect(
      screen.getByTestId("participation-period-start")
    ).toBeInTheDocument();
    expect(screen.getByTestId("participation-period-end")).toBeInTheDocument();
    expect(
      screen.getByText("Participation Period - Start")
    ).toBeInTheDocument();
    expect(screen.getByText("Participation Period - End")).toBeInTheDocument();

    const inputs = screen.getAllByPlaceholderText(
      "MM/DD/YYYY hh:mm aa"
    ) as HTMLInputElement[];
    expect(inputs.length).toBe(2);

    //change Participation Period - Start
    fireEvent.change(inputs[0], { target: { value: "08/02/2023 07:49 AM" } });
    expect(inputs[0].value).toBe("08/02/2023 07:49 AM");

    //change Participation Period - End
    fireEvent.change(inputs[1], { target: { value: "08/03/2023 07:58 AM" } });
    expect(inputs[1].value).toBe("08/03/2023 07:58 AM");
  });

  it("should handle resultDatetime and other timing changes for DiagnosticStudyPerformed DataElement", () => {
    const diagnosticDataElement: DiagnosticStudyPerformed =
      new DiagnosticStudyPerformed();

    render(
      <Timing
        canEdit={true}
        onChange={updateDataElement}
        selectedDataElement={diagnosticDataElement}
      />
    );

    const inputs = screen.getAllByPlaceholderText(
      "MM/DD/YYYY hh:mm aa"
    ) as HTMLInputElement[];
    expect(inputs.length).toBe(5);

    //change Relevant Period - Start
    fireEvent.change(inputs[0], { target: { value: "08/02/2023 07:49 AM" } });
    expect(inputs[0].value).toBe("08/02/2023 07:49 AM");
    //change Relevant Period - End
    fireEvent.change(inputs[1], { target: { value: "08/03/2023 07:58 AM" } });
    expect(inputs[1].value).toBe("08/03/2023 07:58 AM");

    //change Relevant Date/Time
    fireEvent.change(inputs[2], { target: { value: "08/03/2023 08:00 AM" } });
    expect(inputs[2].value).toBe("08/03/2023 08:00 AM");

    //change Author Date/Time
    fireEvent.change(inputs[3], { target: { value: "08/03/2023 08:00 AM" } });
    expect(inputs[3].value).toBe("08/03/2023 08:00 AM");

    //change Result Date/Time
    fireEvent.change(inputs[4], { target: { value: "08/03/2023 08:00 AM" } });
    expect(inputs[4].value).toBe("08/03/2023 08:00 AM");
  });
});
