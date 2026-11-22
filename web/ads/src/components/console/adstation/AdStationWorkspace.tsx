'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { sessionFetch } from '../../../lib/session';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Dialog, DialogPortal, DialogOverlay, DialogPanel, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import styles from './AdStationWorkspace.module.css';

type Preference = 'high' | 'medium' | 'low';
interface Slot {
  id: string; name: string; slotType: string; format: string; slotTagId: string;
  lifecycleStatus?: string; isConsiderationSlot?: boolean; isConsiderationVerified?: boolean;
  adstationReadiness?: {
    networkActiveOnWebsite: boolean; manualReviewApprovedOnCurrentRevision: boolean;
    liveEligible: boolean; displayStatus: string; blockerReasons: string[];
  };
}
interface Deal {
  id: string; clientName: string; campaignTitle: string; destinationUrl: string;
  targetImpressions: number; deliveredImpressions: number; deliveredClicks: number; status: string;
}
interface Props {
  websiteId?: string; websiteDomain?: string; initialPreference?: Preference; onClose?: () => void;
}

async function request(path: string, init?: RequestInit) {
  const response = await sessionFetch(path, init);
  if (!response.ok) throw new Error('The request could not be completed. Please try again.');
  return response.json();
}

export function AdStationWorkspace(props: Props) {
  return <PropertyWorkspace key={props.websiteId ?? 'none'} {...props} />;
}

function PropertyWorkspace({ websiteId, websiteDomain, initialPreference, onClose }: Props) {
  const [slots, setSlots] = useState<Slot[]>();
  const [deals, setDeals] = useState<Deal[]>();
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [preference, setPreference] = useState<Preference | null>(initialPreference ?? null);
  const [notification, setNotification] = useState<{ error: boolean; text: string }>();
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const alive = useRef(true);
  const [copied, setCopied] = useState<string>();
  const [showDeal, setShowDeal] = useState(false);
  const newDealButton = useRef<HTMLButtonElement>(null);
  const [clientName, setClientName] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [target, setTarget] = useState('10000');
  const setupUrl = '/promoter/adstation/setup?websiteId=' + encodeURIComponent(websiteId ?? '');

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    if (!websiteId) { setLoading(false); return () => controller.abort(); }
    setLoading(true);
    void Promise.allSettled([
      request('/api/v1/publisher/websites/' + websiteId + '/slots', { signal: controller.signal }),
      request('/api/v1/adstation/websites/' + websiteId + '/direct-campaigns', { signal: controller.signal }),
    ]).then(([slotResult, dealResult]) => {
      if (controller.signal.aborted) return;
      setSlots(slotResult.status === 'fulfilled' && Array.isArray(slotResult.value.data) ? slotResult.value.data : undefined);
      setDeals(dealResult.status === 'fulfilled' && Array.isArray(dealResult.value.data) ? dealResult.value.data : undefined);
      setLoading(false);
    });
    return () => controller.abort();
  }, [websiteId, revision]);

  async function mutate(path: string, body: object | undefined, method: string, text: string, confirmed?: () => void) {
    if (!websiteId || lock.current) return;
    lock.current = true;
    setPending(true);
    setNotification(undefined);
    try {
      await request(path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      if (!alive.current) return;
      confirmed?.();
      setNotification({ error: false, text });
      setRevision(value => value + 1);
    } catch {
      if (alive.current) setNotification({ error: true, text: 'The change could not be confirmed. Check the current status before trying again.' });
    } finally {
      lock.current = false;
      if (alive.current) setPending(false);
    }
  }

  async function copy(slot: Slot) {
    try {
      await navigator.clipboard.writeText(slot.slotTagId);
      if (alive.current) { setCopied(slot.id); setNotification({ error: false, text: 'Tag ID copied.' }); }
    } catch {
      if (alive.current) setNotification({ error: true, text: 'Copy failed. Open the slot to select its tag ID.' });
    }
  }

  function createDeal(event: FormEvent) {
    event.preventDefault();
    void mutate('/api/v1/adstation/direct-campaigns', {
      websiteId, clientName: clientName.trim(), campaignTitle: title.trim(),
      destinationUrl: url.trim(), targetImpressions: Number(target),
    }, 'POST', 'Direct deal created.', () => {
      setShowDeal(false); setClientName(''); setTitle(''); setUrl(''); setTarget('10000');
    });
  }

  const direct = slots?.filter(slot => slot.slotType === 'direct') ?? [];
  const knownReadiness = direct.map(slot => slot.adstationReadiness).filter((item): item is NonNullable<Slot['adstationReadiness']> => Boolean(item));
  const networkActive = knownReadiness.length ? knownReadiness[0].networkActiveOnWebsite : null;
  const reviewCount = knownReadiness.filter(item => item.manualReviewApprovedOnCurrentRevision).length;

  return <div className={styles.workspace}>
    <section className={styles.panel} aria-labelledby="direct-readiness">
      <h2 id="direct-readiness">Direct delivery readiness</h2>
      <p>{websiteDomain}</p>
      <div className={styles.gates}>
        <div><h3>Network integration on this website</h3>
          <Badge variant="outline" className={networkActive === true ? styles.success : networkActive === false ? styles.warning : undefined}>{loading ? 'Checking' : networkActive === null ? 'Unavailable' : networkActive ? 'Active' : 'Action needed'}</Badge>
          {networkActive !== true && <Link className={styles.link} href="/promoter/websites">Check website and Network installation</Link>}
        </div>
        <div><h3>Staff approval for each Direct slot</h3>
          <Badge variant="outline" className={direct.length && reviewCount === direct.length ? styles.success : direct.length ? styles.warning : undefined}>{loading ? 'Checking' : !slots ? 'Unavailable' : !direct.length ? 'Create a Direct slot' : reviewCount + ' of ' + direct.length + ' approved'}</Badge>
          <p>Approval applies to the current slot revision.</p>
        </div>
      </div>
    </section>
    {notification && <div role={notification.error ? 'alert' : 'status'} className={styles.notice}>
      <span>{notification.text}</span><Button variant="ghost" size="sm" onClick={() => setNotification(undefined)}>Dismiss</Button>
    </div>}
    <Tabs defaultValue="slots" className={styles.panel}>
      <TabsList aria-label="AdStation views" className={styles.tabs}>
        <TabsTrigger value="slots">Ad Slots</TabsTrigger>
        <TabsTrigger value="deals">Direct Deals</TabsTrigger>
        <TabsTrigger value="ratio">Delivery Ratio</TabsTrigger>
      </TabsList>
      <TabsContent value="slots">
        <div className={styles.actions}><Link className={styles.link} href={setupUrl}>Setup a Direct Ad Slot</Link><Link className={styles.link} href="/promoter/websites">Websites &amp; Ad Slots</Link></div>
        {loading ? <p role="status">Loading slots…</p> : !slots ? <div role="alert"><p>Slots could not be loaded.</p><Button onClick={() => setRevision(value => value + 1)}>Try again</Button></div> : slots.length === 0 ? <p>Create a Direct slot to begin setup.</p> :
          <div className={styles.table}><Table><TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Format</TableHead><TableHead>Status and readiness</TableHead><TableHead>Actions</TableHead>
          </TableRow></TableHeader><TableBody>{slots.map(slot => <TableRow key={slot.id}>
            <TableCell>{slot.name}</TableCell><TableCell>{slot.slotType === 'network' ? 'Network' : slot.slotType === 'direct' ? 'Direct' : slot.slotType}</TableCell>
            <TableCell>{slot.format}</TableCell><TableCell>
              <Badge variant="outline">{slot.adstationReadiness?.displayStatus ?? slot.lifecycleStatus ?? 'Unavailable'}</Badge>
              {slot.slotType === 'direct' && <div className={styles.details}>
                <p>Network integration {slot.adstationReadiness ? slot.adstationReadiness.networkActiveOnWebsite ? 'active' : 'required' : 'unavailable'}</p>
                <p>Current revision {slot.adstationReadiness ? slot.adstationReadiness.manualReviewApprovedOnCurrentRevision ? 'approved' : 'awaiting approval' : 'unavailable'}</p>
              </div>}
            </TableCell><TableCell><div className={styles.actions}>
              <Button asChild variant="outline" size="sm"><Link href={'/promoter/websites/' + websiteId + '/slots/' + slot.id}>Manage</Link></Button>
              <Button variant="outline" size="sm" onClick={() => void copy(slot)}>{copied === slot.id ? 'Copied' : 'Copy tag ID'}</Button>
              {slot.slotType === 'direct' && slot.adstationReadiness && <>
                {!slot.adstationReadiness.manualReviewApprovedOnCurrentRevision && <Button variant="outline" size="sm" disabled={pending} onClick={() => void mutate('/api/v1/adstation/slots/' + slot.id + '/submit-review', undefined, 'POST', 'Slot submitted for review.')}>Submit for Review</Button>}
                {slot.adstationReadiness.displayStatus !== 'Live' && <Button size="sm" disabled={pending || !slot.adstationReadiness.liveEligible} onClick={() => void mutate('/api/v1/publisher/slots/' + slot.id, { lifecycleStatus: 'active' }, 'PATCH', 'Direct slot is Live.')}>Go Live</Button>}
              </>}
              {slot.isConsiderationSlot && !slot.isConsiderationVerified && <Button variant="outline" size="sm" disabled={pending} onClick={() => void mutate('/api/v1/adstation/websites/' + websiteId + '/slots/' + slot.id + '/verify-consideration', undefined, 'POST', 'Placement verification confirmed.')}>Verify placement</Button>}
            </div></TableCell>
          </TableRow>)}</TableBody></Table></div>}
      </TabsContent>
      <TabsContent value="deals">
        <div className={styles.actions}><h2>Direct deals</h2><Button ref={newDealButton} disabled={!websiteId || pending} onClick={() => setShowDeal(true)}>New Direct Deal</Button></div>
        {loading ? <p role="status">Loading deals…</p> : !deals ? <div role="alert"><p>Direct deals could not be loaded.</p><Button onClick={() => setRevision(value => value + 1)}>Try again</Button></div> : !deals.length ? <p>Your direct client campaigns will appear here.</p> :
          <div className={styles.table}><Table><TableHeader><TableRow>
            <TableHead>Campaign</TableHead><TableHead>Client</TableHead><TableHead>Impressions</TableHead><TableHead>Clicks</TableHead><TableHead>Status</TableHead>
          </TableRow></TableHeader><TableBody>{deals.map(deal => <TableRow key={deal.id}>
            <TableCell>{deal.campaignTitle}</TableCell><TableCell>{deal.clientName}</TableCell>
            <TableCell>{deal.deliveredImpressions.toLocaleString()} / {deal.targetImpressions.toLocaleString()}</TableCell>
            <TableCell>{deal.deliveredClicks.toLocaleString()}</TableCell><TableCell>{deal.status}</TableCell>
          </TableRow>)}</TableBody></Table></div>}
      </TabsContent>
      <TabsContent value="ratio">
        <h2>Delivery allocation</h2><p>Choose the delivery preference for this website.</p>
        <p>Current preference {preference ?? 'unavailable'}</p>
        <div className={styles.actions}>{([['high', 'High Network'], ['medium', 'Balanced'], ['low', 'Direct Priority']] as const).map(([value, label]) =>
          <Button key={value} aria-pressed={preference === value} variant={preference === value ? 'default' : 'outline'} disabled={!websiteId || pending}
            onClick={() => void mutate('/api/v1/adstation/websites/' + websiteId + '/delivery-preference', { preference: value }, 'PUT', 'Delivery preference saved.', () => setPreference(value))}>{label}</Button>)}</div>
      </TabsContent>
    </Tabs>
    <Dialog open={showDeal} onOpenChange={open => { if (!pending) setShowDeal(open); }}>
      <DialogPortal><DialogOverlay className={styles.overlay} /><DialogPanel className={styles.dialog} onCloseAutoFocus={event => { event.preventDefault(); newDealButton.current?.focus(); }}><DialogHeader><DialogTitle>Register Direct Deal</DialogTitle><DialogDescription>Add a client campaign for {websiteDomain}.</DialogDescription></DialogHeader>
        <form className={styles.form} onSubmit={createDeal}>
          <label>Client or sponsor<Input required maxLength={255} value={clientName} onChange={event => setClientName(event.target.value)} /></label>
          <label>Campaign title<Input required maxLength={255} value={title} onChange={event => setTitle(event.target.value)} /></label>
          <label>Destination URL<Input required type="url" value={url} onChange={event => setUrl(event.target.value)} /></label>
          <label>Target impressions<Input required type="number" min={100} step={100} value={target} onChange={event => setTarget(event.target.value)} /></label>
          {notification?.error && <p role="alert">{notification.text}</p>}
          <div className={styles.actions}><Button type="button" variant="outline" disabled={pending} onClick={() => setShowDeal(false)}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Create deal'}</Button></div>
        </form>
      </DialogPanel></DialogPortal>
    </Dialog>
    {onClose && <Button variant="outline" onClick={onClose}>Close</Button>}
  </div>;
}
