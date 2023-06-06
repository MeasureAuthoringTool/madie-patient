export const mockCqlWithAllCategoriesPresent = `
library QD234 version '0.0.000'

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
valueset "ED": 'urn:oid:2.16.840.1.113883.3.464.1003.101.12.1085' 
valueset "Endotracheal Intubation": 'urn:oid:2.16.840.1.113762.1.4.1045.69' 
valueset "Fibrinolytic Therapy": 'urn:oid:2.16.840.1.113883.3.3157.4020' 
valueset "Intracranial or Intraspinal surgery": 'urn:oid:2.16.840.1.113762.1.4.1170.2' 
valueset "Ischemic Stroke": 'urn:oid:2.16.840.1.113883.3.464.1003.104.12.1024' 
valueset "Major Surgical Procedure": 'urn:oid:2.16.840.1.113883.3.3157.4056' 
valueset "Malignant Intracranial Neoplasm Group": 'urn:oid:2.16.840.1.113762.1.4.1170.3' 
valueset "Mechanical Circulatory Assist Device": 'urn:oid:2.16.840.1.113883.3.3157.4052' 
valueset "Neurologic impairment": 'urn:oid:2.16.840.1.113883.3.464.1003.114.12.1012' 
valueset "Patient Expired": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.309' 
valueset "Percutaneous Coronary Intervention": 'urn:oid:2.16.840.1.113883.3.3157.2000.5' 
valueset "Pregnancy": 'urn:oid:2.16.840.1.113883.3.3157.4055' 
valueset "STEMI": 'urn:oid:2.16.840.1.113883.3.3157.4017' 
valueset "Thrombolytic medications": 'urn:oid:2.16.840.1.113762.1.4.1170.4' 

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
  ["Adverse Event": "Encounter Inpatient"] //Adverse Event
      union ["Allergy/Intolerance": "Observation Services"] //Allergy
      union ["Assessment, Order": "Active Bleeding or Bleeding Diathesis (Excluding Menses)"] //Assessment
      union ["Patient Care Experience": "Active Peptic Ulcer"] //Care Experience
      union ["Care Goal": "Adverse reaction to thrombolytics"] //Care Goal - missing from current list
      union ["Patient Characteristic Payer": "Payer"] //Characteristic
      //threw in a patient demographic - should not show up
      union ["Patient Characteristic Race": "Race"]
      union ["Diagnosis": "Allergy to thrombolytics"] //Condition
      union ["Communication, Performed": "Anticoagulant Medications, Oral"] //Communication
      //threw a negation element in to see if it maps correctly
    //   union ["Communication, Not Performed": "Aortic Dissection and Rupture"] //Communication
      union ["Device, Order": "Cardiopulmonary Arrest"] //Device
      union ["Diagnostic Study, Order": "Cerebral Vascular Lesion"] //Diagnostic Study
      union ["Encounter, Performed": "Emergency Department Visit"] //Encounter
      union ["Family History": "Closed Head and Facial Trauma"] //Family History
      union ["Immunization, Order": "Dementia"] //Immunization
      union ["Intervention, Order": "ED"] //Intervention
      union ["Laboratory Test, Order": "Endotracheal Intubation"] //Laboratory
      union ["Medication, Active": "Fibrinolytic Therapy"] //Medication
      union ["Participation": "Intracranial or Intraspinal surgery"] //Participation
      union ["Physical Exam, Order": "Ischemic Stroke"] //Physical Exam
      union ["Procedure, Order": "Major Surgical Procedure"] //Procedure
      union ["Related Person": "Malignant Intracranial Neoplasm Group"] //Related Person - mssing from curent list
      union ["Substance, Administered": "Mechanical Circulatory Assist Device"] //Substance
      union ["Symptom": "Neurologic impairment"] //Symptom
`;
