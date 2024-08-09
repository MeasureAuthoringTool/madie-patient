export const definitionTemplate = `<pre style="tab-size: 2;"
  data-library-name="{{ libraryName }}" data-statement-name="{{ statementName }}">
<code>
{{> clause}}
</code>
</pre>`;

export const clauseTemplate = `{{~#if @root.highlightCoverage~}}
<span{{#if r}} data-ref-id="{{r}}" style="{{highlightCoverage r}}"{{/if}}>
{{~#if value ~}}
{{ concat value }}
{{~/if ~}}
{{~#if s~}}
{{~#each s~}}
{{> clause ~}}
{{~/each ~}}
{{~/if~}}
</span>
{{~else~}}
<span{{#if r}} data-ref-id="{{r}}" style="{{highlightClause r}}"{{/if}}>
{{~#if value ~}}
{{ concat value }}
{{~/if ~}}
{{~#if s~}}
{{~#each s~}}
{{> clause ~}}
{{~/each ~}}
{{~/if~}}
</span>
{{~/if~}}`;

//clause covered pass (green with underline)
export const clauseCoveredStylePass = {
  color: "#4D7E23",
  "border-bottom-color": "#4D7E23",
  "border-bottom-width": "3px",
};

// clause covered fail (red with double underline)
export const clauseNotCoveredStyleFail = {
  color: "#AE1C1C",
  "border-bottom-color": "#AE1C1C",
  "border-bottom-style": "double",
  "border-bottom-width": "3px",
};

export const clauseNotApplicableStyle = {
  "background-color": "white",
  color: "black",
};
