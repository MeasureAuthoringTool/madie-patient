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
  color: "#9d4728",
  "background-color":"#e9d9d1",
};

export const clauseNotApplicableStyle = {
  "background-color": "white",
  color: "black",
};

// blue text, lighter blue highlight
export const clauseHighlightedStyle = {
  "background-color": "#daeaf5",
  "color":"004e82",
};
