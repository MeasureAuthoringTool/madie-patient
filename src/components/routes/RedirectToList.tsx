import React from "react";
import { Navigate } from "react-router-dom";

//if someone hit's the previous url we're going to get redirected to the list page.
const RedirectToList = () => {
  return <Navigate to={"list-page"} />;
};

export default RedirectToList;
