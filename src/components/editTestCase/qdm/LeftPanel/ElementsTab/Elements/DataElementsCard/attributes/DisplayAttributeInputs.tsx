import React, { useEffect, useState } from "react";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import { DateField } from "@madie/madie-design-system/dist/react";
import { Button } from "@mui/material";

interface DisplayAttributeInputsProps {
  attributeType?:string;
  onChange:(e)=>void;
}

const DisplayAttributeInputs = ({
  attributeType
}: DisplayAttributeInputsProps) => {
  

const displayAttributeInput=()=>{
    
        switch(attributeType){
          case "Date":
            return <DateField
            label="Date"
            value={""}
            handleDateChange={(e) => console.log(e)}
            />
          default: 
            return null;
        }
        
      }






      return (<div>
      {displayAttributeInput()}
      {attributeType?<Button>+</Button>:""}
      
      </div>
  );
};

export default DisplayAttributeInputs;
