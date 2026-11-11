const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the hook's transitions and event handlers without a browser or API.
function harness() {
  const state = [];
  let cursor = 0;
  const element = (type, props, ...children) => ({ type, props: { ...props, children } });
  const react = {
    createElement: element,
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
    },
  };
  const exports = {};
  const source = fs.readFileSync(path.resolve(__dirname, '../src/components/console/useCampaignTable.tsx'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, jsxFactory: 'React.createElement' },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports, React: react,
    require(name) {
      if (name === 'react') return react;
      if (name === '../ui') return { Button: 'button' };
      throw new Error(`Unexpected import ${name}`);
    },
  });
  return () => { cursor = 0; return exports.useCampaignTable(); };
}

const title = item => item.title;
const columns = { count: item => item.count };
const fixtures = Array.from({ length: 45 }, (_, index) => ({
  title: `Ad ${String(index).padStart(2, '0')}`, count: 45 - index,
}));
const searchInput = table => table.controls('ads').props.children[0].props.children.find(child => child?.type === 'input');
const next = table => table.paginate(fixtures).footer.props.children[2].props.onClick();

test('unmatched search produces no rows and no pagination without mutating input', () => {
  const render = harness();
  searchInput(render()).props.onChange({ target: { value: 'missing' } });
  const table = render();
  assert.equal(table.paginate(table.rows(fixtures, title, columns)).items.length, 0);
  assert.equal(table.paginate([]).footer, false);
  assert.equal(fixtures[0].count, 45);
});

test('shrinking results clamps a later page to the last available page', () => {
  const render = harness();
  next(render());
  next(render());
  const result = render().paginate(fixtures.slice(0, 3));
  assert.equal(result.items.length, 3);
  assert.equal(result.items[0].title, 'Ad 00');
  assert.equal(result.footer, false);
});

test('numeric column sorting covers the entire result before pagination and toggles direction', () => {
  const render = harness();
  render().sortButton('count', 'Count').props.onClick();
  let table = render();
  assert.equal(table.sortDirection('count'), 'ascending');
  assert.equal(table.sortDirection('title'), undefined);
  assert.equal(table.paginate(table.rows(fixtures, title, columns)).items[0].count, 1);
  assert.equal(table.sortButton('count', 'Count').props['aria-label'], 'Sort Count descending');
  assert.equal(table.sortButton('count', 'Count').props.type, 'button');
  table.sortButton('count', 'Count').props.onClick();
  table = render();
  assert.equal(table.sortDirection('count'), 'descending');
  assert.equal(table.rows(fixtures, title, columns)[0].count, 45);
  assert.equal(fixtures[0].count, 45);
});

test('changing a column resets pagination and starts ascending', () => {
  const render = harness();
  next(render());
  render().sortButton('count', 'Count').props.onClick();
  const table = render();
  assert.equal(table.paginate(table.rows(fixtures, title, columns)).items[0].count, 1);
  assert.equal(table.paginate(fixtures).items[0].title, 'Ad 00');
});

test('search trims whitespace, ignores case, and resets pagination', () => {
  const render = harness();
  next(render());
  searchInput(render()).props.onChange({ target: { value: '  AD 0  ' } });
  const table = render();
  const rows = table.rows(fixtures, title, columns);
  assert.equal(rows.length, 10);
  assert.equal(table.paginate(rows).items[0].title, 'Ad 00');
  assert.equal(table.paginate(fixtures).items[0].title, 'Ad 00');
});
