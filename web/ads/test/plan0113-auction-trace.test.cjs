const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { JSDOM } = require('jsdom');
const ts = require('typescript');

function renderAuctionTrace(decision) {
  const dom = new JSDOM('<div id="root"></div>');
  const prior = {
    window: global.window,
    document: global.document,
    act: global.IS_REACT_ACT_ENVIRONMENT,
    fetch: global.fetch,
    navigator: global.navigator,
  };
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.getElementById('root');
  const root = createRoot(container);
  const tag = type => ({ variant, size, asChild, ...props }) =>
    asChild ? props.children : React.createElement(type, props);
  const icon = name => props => React.createElement('span', { 'data-icon': name, ...props });
  const deps = {
    'next/link': { default: props => React.createElement('a', props) },
    'next/navigation': { useRouter: () => ({ push: () => {} }) },
    '@/lib/session': {
      sessionFetch: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ status: 'success', data: decision }),
      }),
    },
    '@/lib/auction-pricing': {
      formatAuctionUsd: (value, decimalPlaces) => {
        const digits = typeof value === 'string' ? value : typeof value === 'number' && Number.isSafeInteger(value) ? String(value) : '';
        if (!/^\d+$/.test(digits)) return null;
        const padded = digits.replace(/^0+(?=\d)/, '').padStart(decimalPlaces + 1, '0');
        const whole = padded.slice(0, -decimalPlaces);
        const fraction = padded.slice(-decimalPlaces).replace(/0+$/, '').padEnd(2, '0');
        return `$${whole}.${fraction}`;
      },
    },
    '@/components/ui/badge': { Badge: tag('span') },
    '@/components/ui/button': { Button: tag('button') },
    '@/components/ui/card': { Card: tag('div') },
    '@/components/admin/delivery-evaluation': { DeliveryEvaluation: () => null },
    'lucide-react': new Proxy({}, { get: (_t, prop) => icon(String(prop)) }),
  };

  const source = readFileSync(
    resolve(__dirname, '../src/app/(workspace)/admin/auction-logs/[requestId]/page.tsx'),
    'utf8',
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const exports = {};
  const wrappedReact = {
    ...React,
    use: promiseOrValue => {
      if (promiseOrValue && typeof promiseOrValue.then === 'function') {
        return { requestId: decision.requestId };
      }
      return React.use ? React.use(promiseOrValue) : promiseOrValue;
    },
  };
  vm.runInNewContext(outputText, {
    exports,
    encodeURIComponent,
    require: name => (name === 'react' ? wrappedReact : deps[name] ?? require(name)),
  });

  return {
    mount: async () => {
      await React.act(async () =>
        root.render(React.createElement(exports.default, { params: Promise.resolve({ requestId: decision.requestId }) })),
      );
      await React.act(async () => {});
      return container.textContent;
    },
    cleanup: async () => {
      await React.act(async () => root.unmount());
      dom.window.close();
      global.window = prior.window;
      global.document = prior.document;
      global.IS_REACT_ACT_ENVIRONMENT = prior.act;
    },
  };
}

test('Auction trace renders WAT adaptive hourly redistribution breakdown without UTC mismatch', async () => {
  const harness = renderAuctionTrace({
    requestId: '11111111-1111-4111-8111-111111111111',
    createdAt: '2026-11-14T15:10:00.000Z',
    inventoryClass: 'house',
    slotTagId: 'cf-slot-test',
    trafficRiskStatus: 'low',
    evaluatedCandidates: [],
    excludedCandidates: [
      {
        stage: 'billing_reserve',
        reasonCode: 'HOURLY_PACING_EXHAUSTED',
        campaignId: 'camp-1',
        creativeId: 'cre-1',
        capacityDetails: {
          limitType: 'hourly_pacing',
          unit: 'usd_nanos',
          pacingMode: 'adaptive',
          allowanceNanos: '625000000',
          baseHourlyAllowanceNanos: '210000000',
          watHour: 16,
          remainingWatHours: 8,
          usedOrReservedNanos: '600000000',
          requestedNanos: '100000000',
          availableNanos: '25000000',
        },
      },
    ],
  });

  try {
    const text = await harness.mount();
    assert.match(text, /Effective hourly allowance \(WAT adaptive\)/);
    assert.match(text, /\$0\.625/);
    assert.match(text, /Base hourly schedule\$0\.21/);
    assert.match(text, /Hour 16:00 WAT \(8h remaining; redistributed within daily budget cap\)/);
    assert.doesNotMatch(text, /in this UTC hour/);
  } finally {
    await harness.cleanup();
  }
});

test('Auction trace preserves standard Hourly allowance label for fixed pacing rejections', async () => {
  const harness = renderAuctionTrace({
    requestId: '22222222-2222-4222-8222-222222222222',
    createdAt: '2026-11-14T15:10:00.000Z',
    inventoryClass: 'house',
    slotTagId: 'cf-slot-test',
    trafficRiskStatus: 'low',
    evaluatedCandidates: [],
    excludedCandidates: [
      {
        stage: 'billing_reserve',
        reasonCode: 'HOURLY_PACING_EXHAUSTED',
        capacityDetails: {
          limitType: 'hourly_pacing',
          unit: 'usd_nanos',
          pacingMode: 'fixed',
          allowanceNanos: '210000000',
          usedOrReservedNanos: '200000000',
          requestedNanos: '100000000',
          availableNanos: '10000000',
        },
      },
    ],
  });

  try {
    const text = await harness.mount();
    assert.match(text, /Hourly allowance\$0\.21/);
    assert.doesNotMatch(text, /WAT adaptive/);
    assert.doesNotMatch(text, /Base hourly schedule/);
  } finally {
    await harness.cleanup();
  }
});

