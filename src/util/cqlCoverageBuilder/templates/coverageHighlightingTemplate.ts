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

// blue text, lighter blue highlight
export const clauseHighlightedStyle = {
  "background-color": "#daeaf5",
  color: "004e82",
  "border-bottom-color": "004e82",
  "border-bottom-style": "dashed",
};
