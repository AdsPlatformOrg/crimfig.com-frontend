const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { JSDOM } = require('jsdom');

function loadTsx(relPath, mocks) {
  const filename = path.resolve(__dirname, relPath);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    crypto: global.crypto,
    URL: global.URL,
    Error: global.Error,
    require: (id) => mocks[id] ?? require(id),
  });
  return exports;
}

test('Negative-first & Valid: Add an Advert page enforces readiness, disables Coming Soon types, rejects bad URLs, omits headline, and reuses requestId', async () => {
  const dom = new JSDOM('<main id="root"></main>', { url: 'https://ads.example.test' });
  const prior = {
    window: global.window,
    document: global.document,
    IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT,
  };
  Object.assign(global, {
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });

  const liveCalls = [];
  const replacedRoutes = [];
  let campaignReply = {
    id: 'camp-1',
    moderationStatus: 'pending',
    status: 'draft',
    contentRevision: 2,
    updatedAt: '2026-11-21T00:00:00.000Z',
    adStacks: [{ id: 'stack-1' }],
  };
  let nextAddShouldFail = false;

  const native = (tag) => ({ children, asChild, variant, ...props }) =>
    asChild ? children : React.createElement(tag, props, children);

  const AdSizePolicy = ({ value, selected, onChange }) =>
    React.createElement(
      'div',
      { 'data-testid': 'size-policy', 'data-policy': value },
      React.createElement('button', {
        type: 'button',
        onClick: () => onChange('single', ['medium_rectangle']),
      }, 'Choose Single'),
    );

  const ImagePreparation = ({ onUploaded }) =>
    React.createElement('button', {
      type: 'button',
      onClick: () =>
        onUploaded({
          assetId: 'asset-1',
          cdnUrl: 'https://media.example.test/ad.webp',
          adFormat: 'card',
          width: 300,
          height: 250,
          bytes: 42000,
        }),
    }, 'Mock Upload');

  const navHelpers = require('../src/lib/campaign-navigation.ts');
  let urlInputOnChange = null;

  const mocks = {
    'next/link': { __esModule: true, default: native('a') },
    'next/navigation': {
      useParams: () => ({ id: 'camp-1', stackId: 'stack-1' }),
      useRouter: () => ({ replace: (href) => replacedRoutes.push(href) }),
      useSearchParams: () => ({ get: () => null }),
    },
    '@/components/console/AdSizePolicy': { AdSizePolicy },
    '@/components/console/ImagePreparation': { ImagePreparation },
    '@/components/ui': {
      Button: native('button'),
      Input: (props) => {
        if (props.type === 'url') urlInputOnChange = props.onChange;
        return React.createElement('input', props);
      },
    },
    '@/lib/ads-api-client': {
      adsApi: () => ({
        details: async () => campaignReply,
        liveCreativeAddition: async (id, body) => {
          liveCalls.push({ id, body });
          if (nextAddShouldFail) {
            nextAddShouldFail = false;
            throw new Error('Transient error');
          }
          return { id: 'creative-new-1' };
        },
      }),
    },
    '@/lib/campaign-navigation': navHelpers,
  };

  const { default: NewAdvertPage } = loadTsx('../src/app/(workspace)/campaigns/[id]/stacks/[stackId]/adverts/new/page.tsx', mocks);
  const rootEl = document.getElementById('root');
  const root = createRoot(rootEl);

  try {
    // 1. Negative: Unapproved / draft campaign blocks form
    await React.act(async () => {
      root.render(React.createElement(NewAdvertPage));
    });
    assert.match(rootEl.textContent, /This stack is unavailable for new adverts\./);
    assert.equal(rootEl.querySelector('form'), null);

    // Prepare approved live campaign
    campaignReply = {
      id: 'camp-1',
      moderationStatus: 'approved',
      status: 'active',
      contentRevision: 3,
      updatedAt: '2026-11-21T01:00:00.000Z',
      adStacks: [{ id: 'stack-1' }],
    };

    await React.act(async () => {
      root.render(React.createElement(NewAdvertPage, { key: 'ready' }));
    });

    // 2. Negative: Text Ads and Video Ads are disabled Coming Soon buttons
    const buttons = Array.from(rootEl.querySelectorAll('button'));
    const imageBtn = buttons.find((b) => /Image Ads — Available/.test(b.textContent));
    const textBtn = buttons.find((b) => /Text Ads — Coming Soon/.test(b.textContent));
    const videoBtn = buttons.find((b) => /Video Ads — Coming Soon/.test(b.textContent));
    assert.ok(imageBtn && textBtn && videoBtn);
    assert.equal(imageBtn.getAttribute('aria-pressed'), 'true');
    assert.equal(textBtn.disabled, true);
    assert.equal(videoBtn.disabled, true);

    // 3. Default size policy is dynamic & CTA text matches
    assert.equal(rootEl.querySelector('[data-testid="size-policy"]').getAttribute('data-policy'), 'dynamic');
    const submitBtn = buttons.find((b) => /Submit new Advert for review/.test(b.textContent));
    assert.ok(submitBtn);
    assert.equal(submitBtn.disabled, true);

    // Upload image via mock control
    const uploadBtn = buttons.find((b) => b.textContent === 'Mock Upload');
    await React.act(async () => {
      uploadBtn.click();
    });

    // 4. Negative: Invalid URL (credentials / bad protocol) is rejected without calling API
    await React.act(async () => {
      urlInputOnChange({ target: { value: 'https://user:pass@example.test/landing' } });
    });
    await React.act(async () => {
      rootEl.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    });
    assert.equal(liveCalls.length, 0);
    assert.match(rootEl.querySelector('[role="alert"]').textContent, /Enter a valid website destination\./);

    // 5. Valid submission + idempotent retry on failure (omits headline)
    await React.act(async () => {
      urlInputOnChange({ target: { value: 'https://example.test/landing' } });
    });

    nextAddShouldFail = true;
    await React.act(async () => {
      rootEl.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    });
    assert.equal(liveCalls.length, 1);
    assert.equal('headline' in liveCalls[0].body, false);
    assert.equal(liveCalls[0].body.sizePolicy, 'dynamic');
    assert.match(rootEl.querySelector('[role="alert"]').textContent, /Transient error/);

    // Retry identical payload -> must reuse requestId
    await React.act(async () => {
      rootEl.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    });
    assert.equal(liveCalls.length, 2);
    assert.equal(liveCalls[1].body.requestId, liveCalls[0].body.requestId);
    assert.deepEqual(replacedRoutes, ['/campaigns/camp-1/stacks/stack-1']);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    Object.assign(global, prior);
  }
});

test('Negative-first & Valid: WebsiteAdSlots removes max width/height on new-slot creation but preserves them on detail edit', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://ads.example.test' });
  const prior = {
    window: global.window,
    document: global.document,
    IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT,
  };
  Object.assign(global, {
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });

  const requests = [];
  const native = (tag) => ({ children, asChild, variant, ...props }) =>
    asChild ? children : React.createElement(tag, props, children);
  const table = {};
  for (const [name, tag] of Object.entries({
    Table: 'table',
    TableBody: 'tbody',
    TableCell: 'td',
    TableHead: 'th',
    TableHeader: 'thead',
    TableRow: 'tr',
  })) {
    table[name] = native(tag);
  }

  let nameInputOnChange = null;
  const mocks = {
    'next/link': { __esModule: true, default: native('a') },
    'next/navigation': { useRouter: () => ({ push() {} }) },
    '../../lib/session': {
      dashboardSession: () => ({ getProfile: async () => ({ userId: 'owner-1' }) }),
      sessionFetch: (url, init) => new Promise((resolve) => requests.push({ url, init, resolve })),
    },
    '../ui/button': { Button: native('button') },
    '../ui/input': {
      Input: (props) => {
        if (props.type !== 'number') nameInputOnChange = props.onChange;
        return React.createElement('input', props);
      },
    },
    '../ui/table': table,
    '../ui/tabs': {},
    './HouseSizeSamples': { HouseSizeSamples: () => null },
    './ConsequentialConfirmDialog': { ConsequentialConfirmDialog: ({title,description,onOpenChange}) => React.createElement('div',{role:'dialog'},title,description,React.createElement('button',{onClick:()=>onOpenChange(false)},'Cancel')) },
    '../../lib/house-samples': { houseSampleCatalog: require('../src/data/house-samples.json') },
    './WebsiteAdSlots.module.css': { default: {} },
  };

  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(
      fs.readFileSync(path.join(__dirname, '../src/components/console/WebsiteAdSlots.tsx'), 'utf8'),
      { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }
    ).outputText,
    { exports, AbortController, localStorage: dom.window.localStorage, crypto: global.crypto, require: (name) => mocks[name] ?? require(name) }
  );

  const Component = exports.WebsiteAdSlots;
  const root = createRoot(document.getElementById('root'));
  const siteId = '00000000-0000-4000-8000-000000000011';
  const slotId = '00000000-0000-4000-8000-000000000022';
  const reply = (index, status, data) =>
    React.act(async () =>
      requests[index].resolve({
        ok: status === 200,
        json: async () => ({ data }),
      })
    );

  try {
    // Negative check on new-slot form: no Placement space limits, no number inputs, width/height omitted in POST body
    await React.act(async () => root.render(React.createElement(Component, { websiteId: siteId, mode: 'new' })));
    await reply(0, 200, []);

    assert.equal(document.body.textContent.includes('Placement space limits'), false);
    assert.equal(document.body.textContent.includes('Maximum width'), false);
    assert.equal(document.querySelectorAll('input[type="number"]').length, 0);

    await React.act(async () => nameInputOnChange({ target: { value: 'Responsive Sidebar' } }));
    await React.act(async () =>
      document.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }))
    );

    const postBody = JSON.parse(requests[1].init.body);
    assert.equal('width' in postBody, false);
    assert.equal('height' in postBody, false);
    assert.equal(postBody.name, 'Responsive Sidebar');
    await reply(1, 200, { id: slotId });

    // Existing slot edit still preserves Placement space limits with saved dimensions
    await React.act(async () =>
      root.render(React.createElement(Component, { websiteId: siteId, slotId, mode: 'detail' }))
    );
    await reply(2, 200, [
      {
        id: slotId,
        websiteId: siteId,
        name: 'Legacy Box',
        slotTagId: 'tag-legacy',
        slotType: 'network',
        lifecycleStatus: 'active',
        installationStatus: 'verified',
        width: 300,
        height: 250,
        allowedPresetIds: '["medium_rectangle"]',
        updatedAt: '2026-11-21T00:00:00.000Z',
        format: 'general',
      },
    ]);
    assert.match(document.body.textContent, /Placement space limits/);
    assert.equal(document.querySelectorAll('input[type="number"]').length, 2);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    Object.assign(global, prior);
  }
});

test('PLAN0136 Direct setup accepts one checkbox and creates a managed Direct slot', async () => {
  const dom = new JSDOM('<main id="root"></main>', { url: 'https://ads.example.test' });
  const prior = { window: global.window, document: global.document, IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const root = createRoot(document.getElementById('root'));
  const native = tag => ({ asChild, variant, size, children, ...props }) => asChild ? children : React.createElement(tag, props, children);
  const Button = native('button');
  const calls = [], routes = [];
  let changeName;
  const fixture = { id: 'site-1', domain: 'publisher.example.test', verificationStatus: 'verified', policyStatus: 'approved' };
  const { AdSizePolicy } = loadTsx('../src/components/console/AdSizePolicy.tsx', {
    '../ui/button': { Button },
    './HouseSizeSamples': { HouseSizeSamples: () => React.createElement('p', null, 'Shared House preview') },
    '../../lib/house-samples': { houseSampleCatalog: { families: ['fixture'], assets: [
      { family: 'fixture', preset: 'medium_rectangle', width: 300, height: 250 },
      { family: 'fixture', preset: 'mobile_banner', width: 320, height: 50 },
    ] } },
  });
  const { default: Setup } = loadTsx('../src/app/(workspace)/promoter/adstation/setup/page.tsx', {
    'next/link': { __esModule: true, default: native('a') },
    'next/navigation': { useRouter: () => ({ push: route => routes.push(route) }), useSearchParams: () => new URLSearchParams('websiteId=site-1') },
    '../../../../../components/console/AdSizePolicy': { AdSizePolicy },
    '../../../../../components/ui/card': Object.fromEntries(['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent'].map(key => [key, native('div')])),
    '../../../../../components/ui/button': { Button },
    '../../../../../components/ui/input': { Input: props => { changeName = props.onChange; return React.createElement('input', props); } },
    '../../../../../lib/api-data': { apiData: async () => [{ ...fixture, id: 'site-other' }, fixture, { ...fixture, id: 'unverified', verificationStatus: 'pending' }] },
    '../../../../../lib/session': { sessionFetch: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return { ok: true, json: async () => ({ status: 'success', data: { id: 'slot-1', websiteId: fixture.id, slotType: 'direct' } }) };
    } },
  });
  try {
    await React.act(async () => root.render(React.createElement(Setup)));
    const button = label => Array.from(document.querySelectorAll('button')).find(el => el.textContent === label);
    assert.equal(button('Dynamic Ad Slot').getAttribute('aria-pressed'), 'true');
    assert.equal(button('One Size'), undefined);
    assert.equal(document.querySelectorAll('option').length, 2);
    await React.act(async () => {
      changeName({ target: { value: 'Homepage sponsor' } });
      button('Selected Sizes').click();
    });
    assert.equal(document.querySelector('button[type="submit"]').disabled, true);
    await React.act(async () => document.querySelector('input[type="checkbox"]').click());
    assert.equal(document.querySelector('button[type="submit"]').disabled, false);
    await React.act(async () => document.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/api/v1/publisher/slots/managed');
    const { requestId, ...body } = calls[0].body;
    assert.match(requestId, /^[0-9a-f-]{36}$/);
    assert.deepEqual(body, { websiteId: 'site-1', name: 'Homepage sponsor', slotType: 'direct', format: 'general',
      allowedAdTypes: ['image'], responsive: true, allowedPresetIds: ['medium_rectangle'], lifecycleStatus: 'testing' });
    assert.deepEqual(routes, ['/promoter/websites/site-1/slots/slot-1']);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    Object.assign(global, prior);
  }
});
