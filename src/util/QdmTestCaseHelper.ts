import { TestCase } from "@madie/madie-models";
import * as _ from "lodash";
import { QDMPatient } from "cqm-models";
import { ObjectID } from "bson";
import { v4 as uuidv4 } from "uuid";

export function cloneTestCase(testCase: TestCase) {
  if (_.isNil(testCase)) {
    return;
  }
  const clonedTestCase = _.cloneDeep(testCase);
  if (!_.isEmpty(clonedTestCase.json)) {
    const qdmPatient = new QDMPatient(JSON.parse(clonedTestCase?.json));
    qdmPatient._id = new ObjectID();
    clonedTestCase.json = JSON.stringify(qdmPatient);
  }

  clonedTestCase.patientId = uuidv4();
  clonedTestCase.title = clonedTestCase.title + "-" + new ObjectID().toString();
  clonedTestCase.id = null;

  return clonedTestCase;
}

export function defaultTestCaseJson(testCase: TestCase) {
  if (_.isNil(testCase)) {
    return;
  }
  const clonedTestCase = _.cloneDeep(testCase);
  if (_.isEmpty(clonedTestCase.json)) {
    const qdmPatient = new QDMPatient();
    qdmPatient._id = new ObjectID();
    clonedTestCase.json = JSON.stringify(qdmPatient);
  }
  return clonedTestCase;
}
