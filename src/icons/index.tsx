/*
 This is a library of Icons that can be made directly from vectors found within our current figma
 if you want to add an Icon you find there, export the SVG and wrap it in a react component, passing in props and className like the other examples
 Make sure that you remove all references for "fill" as the className will do that on it's own
*/

import AssessmentIcon from "./Assessment";
import AttributesIcon from "./Attributes";
import CodesIcon from "./Codes";
import CharacteristicIcon from "./Characteristic";
import ConditionIcon from "./Condition";
import DeviceIcon from "./Device";
import EncounterIcon from "./Encounter";
import ExclamationIcon from "./Exclamation";
import ExclamationTriangleIcon from "./ExclamationTriangle";
import FilesIcon from "./Files";
import HeartbeatIcon from "./HeartBeat";
import InterventionIcon from "./Intervention";
import LaboratoryIcon from "./Laboratory";
import MedicationIcon from "./Medication";
import NegationRationaleIcon from "./NegationRationale";
import ProcedureIcon from "./Procedure";
import ShieldIcon from "./Shield";
import SiteMapIcon from "./Sitemap";
import SliderIcon from "./Slider";
import SymptomIcon from "./Symptom";
// default fill to #515151 in case no class supplied. associate a more specific css fill rule to change color
import "./index.scss";

export {
  AssessmentIcon,
  AttributesIcon,
  CodesIcon,
  CharacteristicIcon,
  ConditionIcon,
  DeviceIcon,
  EncounterIcon,
  ExclamationIcon,
  ExclamationTriangleIcon,
  FilesIcon,
  HeartbeatIcon,
  InterventionIcon,
  LaboratoryIcon,
  MedicationIcon,
  NegationRationaleIcon,
  ProcedureIcon,
  ShieldIcon,
  SiteMapIcon,
  SliderIcon,
  SymptomIcon,
};
