export const definitionTemplate = `<pre style="tab-size: 2; line-height: 1.4"
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
  color: "#20744c",
  "border-bottom": "1px solid #20744c",
};

export const clauseNotCoveredStyle = {
  color: "#a63b12",
};

export const clauseNotApplicableStyle = {
  "border-bottom": "1px solid #515151",
};
