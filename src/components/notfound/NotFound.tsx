import React from "react";
import { Link, useLocation } from "react-router-dom";
import tw from "twin.macro";
import { Button } from "@madie/madie-components";
const GoHomeLink = tw.button`text-blue-500 hover:text-blue-900`;

const NotFound = () => {
  return (
    <div data-testid="404-page">
      <h6 style={{ textAlign: "center" }}>404 - Not Found!</h6>

      <GoHomeLink>
        <Link to="/measures" data-testid="404-page-link">
          Go Home
        </Link>
      </GoHomeLink>
    </div>
  );
};
export default NotFound;
