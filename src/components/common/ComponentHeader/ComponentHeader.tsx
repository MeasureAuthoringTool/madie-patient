import React, { useState } from "react";
import "./ComponentHeader.scss";
// Tab heading to display weather or not we can see contents

interface ComponentHeaderProps {
  title: string;
  children?: any;
}

const ComponentHeader = (props: ComponentHeaderProps) => {
  const { title, children } = props;

  return (
    <div
      className="test-case-tab-heading"
      data-testid={`qdm-${props.title}-sub-heading`}
    >
        <h4 className="header">{props.title}</h4>


      <div>
          <div data-testid={`qdm-header-content-${title}`}>{children}</div>
      </div>
    </div>
  );
};

export default ComponentHeader;
