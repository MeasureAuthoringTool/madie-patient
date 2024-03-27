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

// green text, lighter green highlight
export const clauseCoveredStylePass = {
  "background-color": "#ccebe0",
  color: "#20744c",
  "border-bottom-color": "#20744c",
  "border-bottom-style": "solid",
};

// red text, lighter red highlight
export const clauseNotCoveredStyleFail = {
  "background-color": "#edd8d0",
  color: "#a63b12",
  "border-bottom-color": "#a63b12",
  "border-bottom-style": "double",
};

export const clauseNotApplicableStyle = {
  "background-color": "white",
  color: "black",
};
