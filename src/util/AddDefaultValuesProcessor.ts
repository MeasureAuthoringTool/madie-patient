import React from "react";

export function addingDefaultMedicationRequestProperties(entry: any) {
  if (!entry?.resource?.status) {
    entry.resource.status = "active";
  }
  if (!entry?.resource?.intent) {
    entry.resource.intent = "order";
  }
  return entry;
}

export function addingDefaultProcedureProperties(entry: any) {
  if (!entry?.resource?.status) {
    entry.resource.status = "completed";
  }
  return entry;
}
