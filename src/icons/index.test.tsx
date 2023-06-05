import React from "react";

import { render, screen } from "@testing-library/react";
import {
  AssessmentIcon,
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
  ProcedureIcon,
  ShieldIcon,
  SiteMapIcon,
  SymptomIcon,
} from "./index";
describe("Icons", () => {
  const { findByTestId } = screen;
  test("All icons render without classname", async () => {
    await render(
      <div>
        <AssessmentIcon data-testid="assessment" />
        <CharacteristicIcon data-testid="characteristic" />
        <ConditionIcon data-testid="condition" />
        <DeviceIcon data-testid="device" />
        <EncounterIcon data-testid="encounter" />
        <ExclamationIcon data-testid="exclamation" />
        <ExclamationTriangleIcon data-testid="exclamationtriangle" />

        <FilesIcon data-testid="files" />
        <HeartbeatIcon data-testid="heartbeat" />
        <InterventionIcon data-testid="intervention" />
        <LaboratoryIcon data-testid="laboratory" />
        <MedicationIcon data-testid="medication" />
        <ProcedureIcon data-testid="procedure" />
        <ShieldIcon data-testid="shield" />
        <SiteMapIcon data-testid="sitemap" />
        <SymptomIcon data-testid="symptom" />
      </div>
    );
    const assessment = await findByTestId("assessment");
    expect(assessment).toBeInTheDocument();
    const characteristic = await findByTestId("characteristic");
    expect(characteristic).toBeInTheDocument();
    const condition = await findByTestId("condition");
    expect(condition).toBeInTheDocument();
    const device = await findByTestId("device");
    expect(device).toBeInTheDocument();
    const encounter = await findByTestId("encounter");
    expect(encounter).toBeInTheDocument();
    const exclamation = await findByTestId("exclamation");
    expect(exclamation).toBeInTheDocument();
    const exclamationtriangle = await findByTestId("exclamationtriangle");
    expect(exclamationtriangle).toBeInTheDocument();
    const files = await findByTestId("files");
    expect(files).toBeInTheDocument();
    const heartbeat = await findByTestId("heartbeat");
    expect(heartbeat).toBeInTheDocument();
    const intervention = await findByTestId("intervention");
    expect(intervention).toBeInTheDocument();
    const laboratory = await findByTestId("laboratory");
    expect(laboratory).toBeInTheDocument();
    const medication = await findByTestId("medication");
    expect(medication).toBeInTheDocument();
    const procedure = await findByTestId("procedure");
    expect(procedure).toBeInTheDocument();
    const shield = await findByTestId("shield");
    expect(shield).toBeInTheDocument();
    const sitemap = await findByTestId("sitemap");
    expect(sitemap).toBeInTheDocument();
    const symptom = await findByTestId("symptom");
    expect(symptom).toBeInTheDocument();
  });

  test("All icons render default state", async () => {
    await render(
      <div>
        <AssessmentIcon className="madie-icon" data-testid="assessment" />
        <CharacteristicIcon
          className="madie-icon"
          data-testid="characteristic"
        />
        <ConditionIcon className="madie-icon" data-testid="condition" />
        <DeviceIcon className="madie-icon" data-testid="device" />
        <EncounterIcon className="madie-icon" data-testid="encounter" />
        <ExclamationIcon className="madie-icon" data-testid="exclamation" />
        <ExclamationTriangleIcon
          className="madie-icon"
          data-testid="exclamationtriangle"
        />

        <FilesIcon className="madie-icon" data-testid="files" />
        <HeartbeatIcon className="madie-icon" data-testid="heartbeat" />
        <InterventionIcon className="madie-icon" data-testid="intervention" />
        <LaboratoryIcon className="madie-icon" data-testid="laboratory" />
        <MedicationIcon className="madie-icon" data-testid="medication" />
        <ProcedureIcon className="madie-icon" data-testid="procedure" />
        <ShieldIcon className="madie-icon" data-testid="shield" />
        <SiteMapIcon className="madie-icon" data-testid="sitemap" />
        <SymptomIcon className="madie-icon" data-testid="symptom" />
      </div>
    );

    const assessment = await findByTestId("assessment");
    expect(assessment).toBeInTheDocument();
    const characteristic = await findByTestId("characteristic");
    expect(characteristic).toBeInTheDocument();
    const condition = await findByTestId("condition");
    expect(condition).toBeInTheDocument();
    const device = await findByTestId("device");
    expect(device).toBeInTheDocument();
    const encounter = await findByTestId("encounter");
    expect(encounter).toBeInTheDocument();
    const exclamation = await findByTestId("exclamation");
    expect(exclamation).toBeInTheDocument();
    const exclamationtriangle = await findByTestId("exclamationtriangle");
    expect(exclamationtriangle).toBeInTheDocument();
    const files = await findByTestId("files");
    expect(files).toBeInTheDocument();
    const heartbeat = await findByTestId("heartbeat");
    expect(heartbeat).toBeInTheDocument();
    const intervention = await findByTestId("intervention");
    expect(intervention).toBeInTheDocument();
    const laboratory = await findByTestId("laboratory");
    expect(laboratory).toBeInTheDocument();
    const medication = await findByTestId("medication");
    expect(medication).toBeInTheDocument();
    const procedure = await findByTestId("procedure");
    expect(procedure).toBeInTheDocument();
    const shield = await findByTestId("shield");
    expect(shield).toBeInTheDocument();
    const sitemap = await findByTestId("sitemap");
    expect(sitemap).toBeInTheDocument();
    const symptom = await findByTestId("symptom");
    expect(symptom).toBeInTheDocument();
  });

  test("All icons render active state", async () => {
    await render(
      <div>
        <AssessmentIcon className="madie-icon cyan" data-testid="assessment" />
        <CharacteristicIcon
          className="madie-icon cyan"
          data-testid="characteristic"
        />
        <ConditionIcon className="madie-icon cyan" data-testid="condition" />
        <DeviceIcon className="madie-icon cyan" data-testid="device" />
        <EncounterIcon className="madie-icon cyan" data-testid="encounter" />
        <ExclamationIcon
          className="madie-icon cyan"
          data-testid="exclamation"
        />
        <ExclamationTriangleIcon
          className="madie-icon cyan"
          data-testid="exclamationtriangle"
        />

        <FilesIcon className="madie-icon cyan" data-testid="files" />
        <HeartbeatIcon className="madie-icon cyan" data-testid="heartbeat" />
        <InterventionIcon
          className="madie-icon cyan"
          data-testid="intervention"
        />
        <LaboratoryIcon className="madie-icon cyan" data-testid="laboratory" />
        <MedicationIcon className="madie-icon cyan" data-testid="medication" />
        <ProcedureIcon className="madie-icon cyan" data-testid="procedure" />
        <ShieldIcon className="madie-icon cyan" data-testid="shield" />
        <SiteMapIcon className="madie-icon cyan" data-testid="sitemap" />
        <SymptomIcon className="madie-icon cyan" data-testid="symptom" />
      </div>
    );

    const assessment = await findByTestId("assessment");
    expect(assessment).toBeInTheDocument();
    expect(assessment).toHaveClass("cyan");

    const characteristic = await findByTestId("characteristic");
    expect(characteristic).toBeInTheDocument();
    expect(characteristic).toHaveClass("cyan");

    const condition = await findByTestId("condition");
    expect(condition).toBeInTheDocument();
    expect(condition).toHaveClass("cyan");

    const device = await findByTestId("device");
    expect(device).toBeInTheDocument();
    expect(device).toHaveClass("cyan");

    const encounter = await findByTestId("encounter");
    expect(encounter).toBeInTheDocument();
    expect(encounter).toHaveClass("cyan");

    const exclamation = await findByTestId("exclamation");
    expect(exclamation).toBeInTheDocument();
    expect(exclamation).toHaveClass("cyan");

    const exclamationtriangle = await findByTestId("exclamationtriangle");
    expect(exclamationtriangle).toBeInTheDocument();
    expect(exclamationtriangle).toHaveClass("cyan");

    const files = await findByTestId("files");
    expect(files).toBeInTheDocument();
    expect(files).toHaveClass("cyan");

    const heartbeat = await findByTestId("heartbeat");
    expect(heartbeat).toBeInTheDocument();
    expect(heartbeat).toHaveClass("cyan");

    const intervention = await findByTestId("intervention");
    expect(intervention).toBeInTheDocument();
    expect(intervention).toHaveClass("cyan");

    const laboratory = await findByTestId("laboratory");
    expect(laboratory).toBeInTheDocument();
    expect(laboratory).toHaveClass("cyan");

    const medication = await findByTestId("medication");
    expect(medication).toBeInTheDocument();
    expect(medication).toHaveClass("cyan");

    const procedure = await findByTestId("procedure");
    expect(procedure).toBeInTheDocument();
    expect(procedure).toHaveClass("cyan");

    const shield = await findByTestId("shield");
    expect(shield).toBeInTheDocument();
    expect(shield).toHaveClass("cyan");

    const sitemap = await findByTestId("sitemap");
    expect(sitemap).toBeInTheDocument();
    expect(sitemap).toHaveClass("cyan");

    const symptom = await findByTestId("symptom");
    expect(symptom).toBeInTheDocument();
    expect(symptom).toHaveClass("cyan");
  });
});
