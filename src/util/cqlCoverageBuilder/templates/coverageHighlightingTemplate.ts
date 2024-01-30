export const definitionTemplate = `<pre style="tab-size: 2;"
  data-library-name="{{ libraryName }}" data-statement-name="{{ statementName }}">
<code>
{{> highlightClause}}
</code>
</pre>`;

export const highlightTemplate = `{{~#if @root.highlightCoverage~}}
<span{{#if r}} data-ref-id="{{r}}" style="{{highlightCoverage r}}"{{/if}}>
{{~#if value ~}}
{{ add value }}
{{~/if ~}}
{{~#if s~}}
{{~#each s~}}
{{> highlightClause ~}}
{{~/each ~}}
{{~/if~}}
</span>
{{~else~}}
<span{{#if r}} data-ref-id="{{r}}" style="{{colorClause r}}"{{/if}}>
{{~#if value ~}}
{{ add value }}
{{~/if ~}}
{{~#if s~}}
{{~#each s~}}
{{> highlightClause ~}}
{{~/each ~}}
{{~/if~}}
</span>
{{~/if~}}`;

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

// blue with dashed underline
export const clauseHighlightedStyle = {
  color: "#036CB4",
  "text-decoration": "underline",
  "text-decoration-style": "dashed",
  "text-decoration-color": "#036CB4",
  // "border-bottom": "dashed 3px #036CB4",
};
