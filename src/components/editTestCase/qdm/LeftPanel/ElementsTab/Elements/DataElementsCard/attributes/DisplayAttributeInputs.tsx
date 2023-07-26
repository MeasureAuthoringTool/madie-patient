import React, { useEffect, useState } from "react";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import { DateField } from "@madie/madie-design-system/dist/react";
import { Button } from "@mui/material";

interface DisplayAttributeInputsProps {
  attributeType?:any;
  onChange:(e)=>void;
}

const DisplayAttributeInputs = ({
  attributeType
}: DisplayAttributeInputsProps) => {
  

const displayAttributeInput=()=>{
    
        switch(attributeType){
          case "Date":
            return <div><DateField
            label="Date"
            value={""}
            handleDateChange={(e) => console.log(e)}
            /><Button>+</Button></div>
          default:
            return null;
        }
        
      }






  return (
    displayAttributeInput()
  );
};

export default DisplayAttributeInputs;
