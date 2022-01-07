import React from "react";
import { Button } from "@madie/madie-components";
import { Link } from "react-router-dom";

const TestCaseLanding = () => {
  return (
    <div>
      <section>
        <Link to="create" data-testid="create-new-test-case-button">
          <Button buttonTitle="New Test Case" />
        </Link>
      </section>
      <section>
        <span>Show all the test cases here...</span>
      </section>
    </div>
  );
};

export default TestCaseLanding;
