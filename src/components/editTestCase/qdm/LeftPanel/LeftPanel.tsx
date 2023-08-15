import React, { useState } from "react";
import LeftPanelNavTabs from "./LeftPanelNavTabs";
import ElementsTab from "./ElementsTab/ElementsTab";
import { QdmPatientProvider } from "../../../../util/QdmPatientContext";
import { useFormikContext } from "formik";

const LeftPanel = (props: { canEdit: boolean }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");
  const formik: any = useFormikContext();

  return (
    <div className="left-panel">
      <div className="tab-container">
        <LeftPanelNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="panel-content">
        <QdmPatientProvider>
          {activeTab === "elements" && <ElementsTab canEdit={props.canEdit} />}
          {activeTab === "json" && <p>{formik.values?.json}</p>}
        </QdmPatientProvider>
      </div>
    </div>
  );
};

export default LeftPanel;
