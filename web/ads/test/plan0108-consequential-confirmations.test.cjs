const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

function loadComponent(filePath, deps = {}) {
  const source = readFileSync(resolve(__dirname, filePath), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: name => deps[name] ?? require(name),
  });
  return exports;
}

test('ConsequentialConfirmDialog renders title, consequences and accessible buttons', () => {
  const { ConsequentialConfirmDialog } = loadComponent(
    '../src/components/console/ConsequentialConfirmDialog.tsx',
    {
      '@radix-ui/react-dialog': {
        Root: ({ children, open }) => open ? React.createElement('div', { 'data-dialog-root': true }, children) : null,
        Portal: ({ children }) => React.createElement('div', { 'data-portal': true }, children),
        Overlay: props => React.createElement('div', props),
        Content: props => React.createElement('div', props),
        Title: props => React.createElement('h2', props),
        Description: ({ asChild, children, ...props }) => asChild ? children : React.createElement('p', props, children),
        Close: ({ asChild, children, ...props }) => asChild ? children : React.createElement('button', props, children),
      },
      '../ui/button': {
        Button: ({ children, variant, size, asChild, ...props }) => React.createElement('button', props, children),
      },
      'lucide-react': {
        X: () => React.createElement('span', null, 'X'),
        AlertTriangle: () => React.createElement('span', null, '!'),
      },
    }
  );

  const markup = renderToStaticMarkup(
    React.createElement(ConsequentialConfirmDialog, {
      open: true,
      onOpenChange: () => {},
      title: 'Stop delivery and begin editing?',
      description: 'New ad delivery for Jed Test Campaign will stop immediately.',
      consequenceSummary: 'Existing escrow funding stays in place.',
      confirmLabel: 'Stop delivery and begin editing',
      cancelLabel: 'Keep current submission',
      confirmVariant: 'default',
      isPending: false,
      onConfirm: () => {},
    })
  );

  assert.match(markup, /Stop delivery and begin editing\?/);
  assert.match(markup, /New ad delivery for Jed Test Campaign will stop immediately/);
  assert.match(markup, /Existing escrow funding stays in place/);
  assert.match(markup, /Keep current submission/);
  assert.match(markup, /Stop delivery and begin editing/);
});

test('ConsequentialConfirmDialog reflects pending busy state safely', () => {
  const { ConsequentialConfirmDialog } = loadComponent(
    '../src/components/console/ConsequentialConfirmDialog.tsx',
    {
      '@radix-ui/react-dialog': {
        Root: ({ children, open }) => open ? React.createElement('div', null, children) : null,
        Portal: ({ children }) => React.createElement('div', null, children),
        Overlay: props => React.createElement('div', props),
        Content: props => React.createElement('div', props),
        Title: props => React.createElement('h2', props),
        Description: ({ asChild, children, ...props }) => asChild ? children : React.createElement('p', props, children),
        Close: ({ asChild, children, ...props }) => asChild ? children : React.createElement('button', props, children),
      },
      '../ui/button': {
        Button: ({ children, disabled, ...props }) => React.createElement('button', { ...props, disabled }, children),
      },
      'lucide-react': {
        X: () => React.createElement('span', null, 'X'),
        AlertTriangle: () => React.createElement('span', null, '!'),
      },
    }
  );

  const markup = renderToStaticMarkup(
    React.createElement(ConsequentialConfirmDialog, {
      open: true,
      onOpenChange: () => {},
      title: 'Pause ad delivery?',
      description: 'Live delivery will be paused immediately.',
      confirmLabel: 'Pause delivery',
      isPending: true,
      onConfirm: () => {},
    })
  );

  assert.match(markup, /Processing…/);
  assert.match(markup, /disabled/);
});

