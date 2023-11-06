import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import DataElementsList from "./DataElementsList";
import userEvent from "@testing-library/user-event";

const assessmentDataElements = [
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059d7",
    requester: [],
    qdmTitle: "Assessment, Order",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.131",
    qdmCategory: "assessment",
    qdmStatus: "order",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentOrder",
    id: "6480f13e91f25700004059d7",
    codeListId: "2.16.840.1.113883.3.3157.4036",
    description:
      "Assessment, Order: Active Bleeding or Bleeding Diathesis (Excluding Menses)",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059cd",
    relatedTo: [],
    performer: [],
    qdmTitle: "Assessment, Performed",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
    qdmCategory: "assessment",
    qdmStatus: "performed",
    qdmVersion: "5.6",
    _type: "QDM::AssessmentPerformed",
    id: "6480f13e91f25700004059cd",
    components: [],
    codeListId: "2.16.840.1.113883.3.3157.4031",
    description: "Assessment, Performed: Active Peptic Ulcer",
  },
  {
    dataElementCodes: [],
    _id: "6480f13e91f25700004059c7",
    requester: [],
    qdmTitle: "Assessment, Recommended",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.118",
    qdmCategory: "assessment",
    qdmStatus: null,
    qdmVersion: "5.6",
    _type: "QDM::AssessmentRecommended",
    id: "6480f13e91f25700004059c7",
    codeListId: "2.16.840.1.113762.1.4.1170.6",
    description: "Assessment, Recommended: Adverse reaction to thrombolytics",
  },
];

const mockSetSelectedDataElement = jest.fn();

describe("DataElementsList", () => {
  it("Should render clickable tiles for Data Elements", () => {
    render(
      <DataElementsList
        availableDataElements={assessmentDataElements}
        setSelectedDataElement={mockSetSelectedDataElement}
      />
    );

    const dataElementListContainer = screen.getByTestId(
      "data-elementslist-container"
    ) as HTMLDivElement;
    expect(dataElementListContainer).toBeInTheDocument();
    const dataElementsTiles =
      dataElementListContainer.getElementsByClassName("data-types-button");
    expect(dataElementsTiles).toHaveLength(3);

    const categoryTitles =
      dataElementListContainer.getElementsByClassName("title");
    expect(categoryTitles[0]).toHaveTextContent("Order");
    expect(categoryTitles[1]).toHaveTextContent("Performed");
    // Assuming qdmStatus is null and qdmTitle is used instead
    expect(categoryTitles[2]).toHaveTextContent("Assessment, Recommended");

    const categoriesSubText =
      dataElementListContainer.getElementsByClassName("sub-text");
    expect(categoriesSubText[0]).toHaveTextContent(
      "Active Bleeding or Bleeding Diathesis (Excluding Menses)"
    );
    expect(categoriesSubText[1]).toHaveTextContent("Active Peptic Ulcer");
    expect(categoriesSubText[2]).toHaveTextContent(
      "Adverse reaction to thrombolytics"
    );

    const addDataElementButton = screen.getByTestId(
      "data-type-Assessment, Recommended: Adverse reaction to thrombolytics"
    );
    userEvent.click(addDataElementButton);
    expect(mockSetSelectedDataElement).toHaveBeenCalledWith(
      assessmentDataElements[2]
    );
  });
});
