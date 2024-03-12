import { GroupCoverageResult } from "../../../../util/cqlCoverageBuilder/CqlCoverageBuilder";

export const calculationResults: GroupCoverageResult = {
  "64ef": [
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Qualifying Encounters">\n<code>\n<span data-ref-id="17" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>// single line comment\ndefine &quot;Qualifying Encounters&quot;:\n  </span><span data-ref-id="16" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span data-ref-id="11" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>[&quot;Encounter, Performed&quot;: </span><span><span>&quot;Encounter Inpatient&quot;</span></span><span>]</span></span></span><span> Encounter</span></span></span><span>\n    </span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>where </span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="12" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>Encounter</span></span><span>.</span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>relevantPeriod</span></span></span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"> ends during </span><span data-ref-id="14" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "Qualifying Encounters",
      type: undefined,
      result:
        "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Initial Population">\n<code>\n<span data-ref-id="19" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;Initial Population&quot;:\n  </span><span data-ref-id="18" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Qualifying Encounters&quot;</span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "Initial Population",
      type: undefined,
      result:
        "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Denominator">\n<code>\n<span data-ref-id="21" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;Denominator&quot;:\n  </span><span data-ref-id="20" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Initial Population&quot;</span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "Denominator",
      type: undefined,
      result:
        "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Numerator">\n<code>\n<span data-ref-id="29" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span>define &quot;Numerator&quot;:\n  </span><span data-ref-id="28" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span><span data-ref-id="23" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="22" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span>&quot;Qualifying Encounters&quot;</span></span></span><span> Enc</span></span></span><span>\n    </span><span data-ref-id="27" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span>where </span><span data-ref-id="27" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span data-ref-id="25" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span data-ref-id="24" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>Enc</span></span><span>.</span><span data-ref-id="25" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span>lengthOfStay</span></span></span><span> &gt; </span><span data-ref-id="26" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>1 day</span></span></span></span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "Numerator",
      type: undefined,
      result: "FALSE ([])",
    },
    {
      type: "FunctionDef",
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Denominator Observations">\n<code>\n<span data-ref-id="34" style=""><span>/**\n * Test comment 1\n * another comment.\n */\ndefine function &quot;Denominator Observations&quot;(QualifyingEncounter &quot;Encounter, Performed&quot;):\n  </span><span data-ref-id="33" style=""><span data-ref-id="33" style=""><span>duration in days of </span><span data-ref-id="32" style=""><span data-ref-id="31" style=""><span>QualifyingEncounter</span></span><span>.</span><span data-ref-id="32" style=""><span>relevantPeriod</span></span></span></span></span></span></code>\n</pre>',
      relevance: "NA",
      name: "Denominator Observations",
      result: "NA",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Unused Encounters">\n<code>\n<span data-ref-id="42" style=""><span>define &quot;Unused Encounters&quot;:\n  </span><span data-ref-id="41" style=""><span><span data-ref-id="36" style=""><span data-ref-id="35" style=""><span data-ref-id="35" style=""><span>[&quot;Encounter, Performed&quot;: </span><span><span>&quot;Encounter Inpatient&quot;</span></span><span>]</span></span></span><span> Encounter</span></span></span><span>\n    </span><span data-ref-id="40" style=""><span>where </span><span data-ref-id="40" style=""><span data-ref-id="38" style=""><span data-ref-id="37" style=""><span>Encounter</span></span><span>.</span><span data-ref-id="38" style=""><span>relevantPeriod</span></span></span><span data-ref-id="40" style=""> ends during </span><span data-ref-id="39" style=""><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>\n</pre>',
      relevance: "NA",
      name: "Unused Encounters",
      type: undefined,
      result: "NA",
    },
    {
      html: '<pre style="tab-size: 2;"\n  data-library-name="MAT6264Lib" data-statement-name="SDE Ethnicity">\n<code>\n<span data-ref-id="151" style="color:#4D7E23;border-bottom-color:#4D7E23;border-bottom-width:3px"><span>define &quot;SDE Ethnicity&quot;:\n  </span><span data-ref-id="150" style="color:#4D7E23;border-bottom-color:#4D7E23;border-bottom-width:3px"><span>[&quot;Patient Characteristic Ethnicity&quot;: </span><span><span>&quot;Ethnicity&quot;</span></span><span>]</span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "SDE Ethnicity",
      result: "[PatientCharacteristicEthnicity\nCODE: CDCREC 2135-2]",
      type: undefined,
    },
  ],
  "64ec": [
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Qualifying Encounters">\n<code>\n<span data-ref-id="17" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>// single line comment\ndefine &quot;Qualifying Encounters&quot;:\n  </span><span data-ref-id="16" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span data-ref-id="11" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="10" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>[&quot;Encounter, Performed&quot;: </span><span><span>&quot;Encounter Inpatient&quot;</span></span><span>]</span></span></span><span> Encounter</span></span></span><span>\n    </span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>where </span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="12" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>Encounter</span></span><span>.</span><span data-ref-id="13" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>relevantPeriod</span></span></span><span data-ref-id="15" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"> ends during </span><span data-ref-id="14" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "Qualifying Encounters",
      type: undefined,
      result:
        "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Initial Population">\n<code>\n<span data-ref-id="19" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;Initial Population&quot;:\n  </span><span data-ref-id="18" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Qualifying Encounters&quot;</span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "Initial Population",
      type: undefined,
      result:
        "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Denominator">\n<code>\n<span data-ref-id="21" style=""><span>define &quot;Denominator&quot;:\n  </span><span data-ref-id="20" style=""><span>&quot;Initial Population&quot;</span></span></span></code>\n</pre>',
      relevance: "NA",
      name: "Denominator",
      type: undefined,
      result: "NA",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Numerator">\n<code>\n<span data-ref-id="29" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span>define &quot;Numerator&quot;:\n  </span><span data-ref-id="28" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span><span data-ref-id="23" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="22" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span>&quot;Qualifying Encounters&quot;</span></span></span><span> Enc</span></span></span><span>\n    </span><span data-ref-id="27" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span>where </span><span data-ref-id="27" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span data-ref-id="25" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span data-ref-id="24" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>Enc</span></span><span>.</span><span data-ref-id="25" style="background-color:#edd8d0;color:#a63b12;border-bottom-color:#a63b12;border-bottom-style:double"><span>lengthOfStay</span></span></span><span> &gt; </span><span data-ref-id="26" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>1 day</span></span></span></span></span></span></code>\n</pre>',
      relevance: "TRUE",
      name: "Numerator",
      type: undefined,
      result: "FALSE ([])",
    },
    {
      type: "FunctionDef",
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Denominator Observations">\n<code>\n<span data-ref-id="34" style=""><span>/**\n * Test comment 1\n * another comment.\n */\ndefine function &quot;Denominator Observations&quot;(QualifyingEncounter &quot;Encounter, Performed&quot;):\n  </span><span data-ref-id="33" style=""><span data-ref-id="33" style=""><span>duration in days of </span><span data-ref-id="32" style=""><span data-ref-id="31" style=""><span>QualifyingEncounter</span></span><span>.</span><span data-ref-id="32" style=""><span>relevantPeriod</span></span></span></span></span></span></code>\n</pre>',
      relevance: "NA",
      name: "Denominator Observations",
      result: "NA",
    },
    {
      html: '<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"\n  data-library-name="QDMTestMeasure" data-statement-name="Unused Encounters">\n<code>\n<span data-ref-id="42" style=""><span>define &quot;Unused Encounters&quot;:\n  </span><span data-ref-id="41" style=""><span><span data-ref-id="36" style=""><span data-ref-id="35" style=""><span data-ref-id="35" style=""><span>[&quot;Encounter, Performed&quot;: </span><span><span>&quot;Encounter Inpatient&quot;</span></span><span>]</span></span></span><span> Encounter</span></span></span><span>\n    </span><span data-ref-id="40" style=""><span>where </span><span data-ref-id="40" style=""><span data-ref-id="38" style=""><span data-ref-id="37" style=""><span>Encounter</span></span><span>.</span><span data-ref-id="38" style=""><span>relevantPeriod</span></span></span><span data-ref-id="40" style=""> ends during </span><span data-ref-id="39" style=""><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></code>\n</pre>',
      relevance: "NA",
      name: "Unused Encounters",
      type: undefined,
      result: "NA",
    },
  ],
};
