export const definitionTemplate = `<pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4"
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

export const clauseCoveredStyle = {
  "background-color": "#ccebe0",
  color: "#20744c",
  "border-bottom-color": "#20744c",
  "border-bottom-style": "solid",
};

export const clauseNotCoveredStyle = {
  "background-color": "#edd8d0",
  color: "#a63b12",
  "border-bottom-color": "#a63b12",
  "border-bottom-style": "double",
};
