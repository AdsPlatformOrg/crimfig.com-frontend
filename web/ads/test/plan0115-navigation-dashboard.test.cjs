const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadWorkspaceNavigation() {
  const sourcePath = path.resolve(__dirname, '../src/lib/workspace-navigation.ts');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;

  const iconProxy = new Proxy(
    {},
    {
      get: (_target, prop) => () => String(prop),
    },
  );
  const moduleExports = {};
  vm.runInNewContext(compiled, {
    exports: moduleExports,
    require: (id) => {
      if (id === 'lucide-react') return iconProxy;
      return {};
    },
  });
  return moduleExports;
}

test('Negative: Advertiser Studio sidebar must not expose Create Campaign or AdStation', () => {
  const { workspaceNavigation } = loadWorkspaceNavigation();
  const advertiserGroups = workspaceNavigation('advertiser');
  const allItems = advertiserGroups.flatMap((g) => g.items.flatMap((i) => i.children || [i]));
  const labels = allItems.map((i) => i.label);
  const hrefs = allItems.map((i) => i.href);

  assert.equal(labels.includes('Create Campaign'), false);
  assert.equal(hrefs.includes('/campaigns/new'), false);
  assert.equal(
    advertiserGroups.some((g) => g.title === 'AdStation'),
    false,
  );
  assert.equal(
    allItems.some((i) => String(i.href).includes('/adstation')),
    false,
  );
});

test('Advertiser Studio uses Ads Console nomenclature with Dashboard and My Ad Campaigns', () => {
  const { workspaceNavigation, resolveWorkspaceContext } = loadWorkspaceNavigation();
  const advertiserGroups = workspaceNavigation('advertiser');
  const adsConsole = advertiserGroups.find((g) => g.title === 'Ads Console');
  assert.ok(adsConsole, 'Ads Console group should exist');
  assert.deepEqual(
    Array.from(adsConsole.items, (i) => i.label),
    ['Dashboard', 'My Ad Campaigns', 'Advertiser Rewards'],
  );

  assert.deepEqual(Array.from(resolveWorkspaceContext('/dashboard')), ['advertiser', 'dashboard']);
  assert.deepEqual(Array.from(resolveWorkspaceContext('/campaigns')), ['advertiser', 'campaigns']);
  assert.deepEqual(Array.from(resolveWorkspaceContext('/advertiser/rewards', 'promoter')), ['advertiser', 'advertiser_rewards']);
  assert.equal(workspaceNavigation('promoter').flatMap((group) => group.items).some((item) => item.id === 'advertiser_rewards'), false);
});

test('Promoter Hub hierarchy contains Dashboard, CrimFig Ad Network, and AdStation', () => {
  const { workspaceNavigation, resolveWorkspaceContext } = loadWorkspaceNavigation();
  const promoterGroups = workspaceNavigation('promoter');
  const titles = promoterGroups.map((g) => g.title);

  assert.ok(titles.includes('Promoter Hub'));
  assert.ok(titles.includes('CrimFig Ad Network'));
  assert.ok(titles.includes('AdStation'));

  const adNetwork = promoterGroups.find((g) => g.title === 'CrimFig Ad Network');
  assert.deepEqual(
    Array.from(adNetwork.items, (i) => i.label),
    ['Dashboard', 'Get Started', 'Reports'],
  );
  const getStarted = adNetwork.items.find((i) => i.label === 'Get Started');
  assert.ok(Array.isArray(getStarted.children));
  assert.deepEqual(
    Array.from(getStarted.children, (c) => c.label),
    ['Setup Guide', 'On Website', 'On Mobile App', 'Affiliate Link'],
  );

  const adstation = promoterGroups.find((g) => g.title === 'AdStation');
  assert.deepEqual(
    Array.from(adstation.items, (i) => i.label),
    ['Dashboard', 'Setup a Direct Ad Slot'],
  );

  assert.deepEqual(Array.from(resolveWorkspaceContext('/promoter')), ['promoter', 'promoter_dashboard']);
  assert.deepEqual(Array.from(resolveWorkspaceContext('/promoter/ad-network')), ['promoter', 'ad_network_dashboard']);
  assert.deepEqual(Array.from(resolveWorkspaceContext('/promoter/ad-network/get-started')), ['promoter', 'ad_network_overview_guide']);
  assert.deepEqual(Array.from(resolveWorkspaceContext('/promoter/adstation')), ['promoter', 'adstation']);
  assert.deepEqual(Array.from(resolveWorkspaceContext('/promoter/adstation/setup')), ['promoter', 'adstation_setup']);
});

test('Sidebar compact typography and spacing preserve 44px mobile touch targets', () => {
  const sidebarSource = fs.readFileSync(
    path.resolve(__dirname, '../src/components/DashboardSidebar.tsx'),
    'utf8',
  );
  assert.match(sidebarSource, /fontSize:\s*'12px'/);
  assert.match(sidebarSource, /gap:\s*'12px'/);
  assert.match(sidebarSource, /gap:\s*'2px'/);
  assert.match(sidebarSource, /targetMinHeight\s*=\s*isMobileOpen\s*\?\s*44\s*:\s*34/);
});

test('Advertiser ConsoleDashboard renders 3 headline KPI cards with validClicks and Additional Details', () => {
  const dashSource = fs.readFileSync(
    path.resolve(__dirname, '../src/components/console/ConsoleDashboard.tsx'),
    'utf8',
  );
  assert.match(dashSource, /Ad Spend/);
  assert.match(dashSource, /Impressions/);
  assert.match(dashSource, /Clicks/);
  assert.match(dashSource, /validClicks/);
  assert.match(dashSource, /Additional Details/);
  assert.doesNotMatch(dashSource, /AdvertiserMilestonesCard|Hovers, Touches|Observed &amp; Billed Clicks/);
  assert.match(dashSource, /Billed CTR/);
  assert.equal(/Observed clicks<\/span>/.test(dashSource), false);
});

test('ProtectedWorkspace uses 3 skeleton cards for /dashboard and 4 for /promoter', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '../src/components/ProtectedWorkspace.tsx'),
    'utf8',
  );
  assert.match(source, /pathname === ["']\/dashboard["'] \? 3 : pathname === ["']\/promoter["'] \? 4 : 0/);
});

test('PromoterDashboard, Affiliate gating, and AdStation gating UI enforce honest states', () => {
  const promoterDash = fs.readFileSync(
    path.resolve(__dirname, '../src/components/console/promoter/PromoterDashboard.tsx'),
    'utf8',
  );
  assert.match(promoterDash, /Earnings/);
  assert.match(promoterDash, /Impressions/);
  assert.match(promoterDash, /Clicks/);
  assert.match(promoterDash, /Acquisitions/);
  assert.match(promoterDash, /Unavailable/);

  const individuals = fs.readFileSync(
    path.resolve(__dirname, '../src/components/console/promoter/PromoterIndividualsView.tsx'),
    'utf8',
  );
  assert.match(individuals, /72-hour clearance hold/);
  assert.match(individuals, /Affiliate Links V2/);

  const adstation = fs.readFileSync(
    path.resolve(__dirname, '../src/components/console/adstation/AdStationWorkspace.tsx'),
    'utf8',
  );
  assert.match(adstation, /Direct Ad Slot LIVE Requirements/);
  assert.match(adstation, /Submit for Review/);
  assert.match(adstation, /Go Live/);
});

