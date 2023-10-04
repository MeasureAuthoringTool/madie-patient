import React, { useState } from "react";
import "twin.macro";
import "styled-components/macro";
import LeftPanelNavTabs from "./LeftPanelNavTabs";
import ElementsTab from "./ElementsTab/ElementsTab";
import { QdmPatientProvider } from "../../../../util/QdmPatientContext";
import { useFormikContext } from "formik";
import Editor from "../../../editor/Editor";

const LeftPanel = (props: {
  canEdit: boolean;
  handleTestCaseErrors: Function;
}) => {
  const { canEdit, handleTestCaseErrors } = props;
  const [activeTab, setActiveTab] = useState<string>("elements");
  const formik: any = useFormikContext();

  return (
    <div className="left-panel">
      <div className="tab-container">
        <LeftPanelNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="panel-content">
        <QdmPatientProvider>
          {activeTab === "elements" && (
            <ElementsTab
              canEdit={canEdit}
              handleTestCaseErrors={handleTestCaseErrors}
            />
          )}
          {activeTab === "json" && (
            <Editor
              value={
                formik.values?.json
                  ? JSON.stringify(JSON.parse(formik.values?.json), null, 2)
                  : ""
              }
              height="100%"
              readOnly={true}
            />
          )}
        </QdmPatientProvider>
      </div>
    </div>
  );
};

export default LeftPanel;
