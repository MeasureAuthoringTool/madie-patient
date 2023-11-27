export const measureCql = `library HighlightingQDM version '0.0.000'

using QDM version '5.6'

codesystem "Test": 'urn:oid:2.16.840.1.113883.6.1'
codesystem "LOINC": 'urn:oid:2.16.840.1.113883.6.1'

valueset "Emergency Department Visit": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'
valueset "Encounter Inpatient": 'urn:oid:2.16.840.1.113883.3.666.5.307'
valueset "Ethnicity": 'urn:oid:2.16.840.1.114222.4.11.837'
valueset "Observation Services": 'urn:oid:2.16.840.1.113762.1.4.1111.143'
valueset "ONC Administrative Sex": 'urn:oid:2.16.840.1.113762.1.4.1'
valueset "Payer": 'urn:oid:2.16.840.1.114222.4.11.3591'
valueset "Race": 'urn:oid:2.16.840.1.114222.4.11.836'
valueset "Active Bleeding or Bleeding Diathesis (Excluding Menses)": 'urn:oid:2.16.840.1.113883.3.3157.4036'
valueset "Active Peptic Ulcer": 'urn:oid:2.16.840.1.113883.3.3157.4031'
valueset "Adverse reaction to thrombolytics": 'urn:oid:2.16.840.1.113762.1.4.1170.6'
valueset "Allergy to thrombolytics": 'urn:oid:2.16.840.1.113762.1.4.1170.5'
valueset "Anticoagulant Medications, Oral": 'urn:oid:2.16.840.1.113883.3.3157.4045'
valueset "Aortic Dissection and Rupture": 'urn:oid:2.16.840.1.113883.3.3157.4028'
valueset "birth date": 'urn:oid:2.16.840.1.113883.3.560.100.4'
valueset "Cardiopulmonary Arrest": 'urn:oid:2.16.840.1.113883.3.3157.4048'
valueset "Cerebral Vascular Lesion": 'urn:oid:2.16.840.1.113883.3.3157.4025'
valueset "Closed Head and Facial Trauma": 'urn:oid:2.16.840.1.113883.3.3157.4026'
valueset "Dementia": 'urn:oid:2.16.840.1.113883.3.3157.4043'
valueset "Discharge To Acute Care Facility": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.87'

code "Birth date": '21112-8' from "LOINC" display 'Birth date'

parameter "Measurement Period" Interval<DateTime>

context Patient

define "SDE Ethnicity":
  ["Patient Characteristic Ethnicity": "Ethnicity"]

define "SDE Payer":
  ["Patient Characteristic Payer": "Payer"]

define "SDE Race":
  ["Patient Characteristic Race": "Race"]

define "SDE Sex":
  ["Patient Characteristic Sex": "ONC Administrative Sex"]


define "Initial Population":
      ["Encounter, Performed": "Emergency Department Visit"] //Encounter
      union ["Encounter, Performed": "Closed Head and Facial Trauma"] //Encounter
      union ["Encounter, Performed": "Dementia"] //Encounter
      
define "Denominator":
  "Initial Population"
  
define "Denoninator Exclusion":
  ["Encounter, Performed"] E where (duration in days of E.relevantPeriod) > 10
  
define "Numerator":
  ["Encounter, Performed"] E where E.relevantPeriod starts during day of "Measurement Period"

define function denomObs(Encounter "Encounter, Performed"):
  duration in seconds of Encounter.relevantPeriod
  
define function numerObs(Encounter "Encounter, Performed"):
  duration in days of Encounter.relevantPeriod
  
define "IP2":
    exists ["Encounter, Performed"] E`;
