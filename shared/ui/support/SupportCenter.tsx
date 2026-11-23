"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './SupportCenter.module.css';

export const SUPPORT_EMAIL = 'support@crimfig.com';

type Request = (url: string, init?: RequestInit) => Promise<Response>;
export type SupportCategory = 'technical' | 'billing' | 'campaign_moderation' | 'account' | 'other';

type Message = {
  id: string;
  body: string;
  is_staff_reply: boolean;
  is_internal_note: boolean;
  created_at: string;
};

type Ticket = {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  updated_at: string;
  assigned_to_staff_id?: string;
  messages?: Message[];
  audit?: { actor_id: string; action: string; created_at: string }[];
};

const statuses = ['open', 'in_progress', 'waiting_on_user', 'resolved', 'closed'] as const;
const categories: readonly SupportCategory[] = [
  'technical',
  'billing',
  'campaign_moderation',
  'account',
  'other',
];

const categoryLabels: Record<string, string> = {
  technical: 'Technical & Ad Delivery',
  billing: 'Billing & Payouts',
  campaign_moderation: 'Campaign & Ad Review',
  account: 'Account & Security',
  other: 'General Inquiry',
};

const readable = (s?: string) => (s ?? '').replaceAll('_', ' ');

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'resolved':
    case 'closed':
      return styles.badgeSuccess;
    case 'waiting_on_user':
      return styles.badgeWarning;
    case 'in_progress':
      return styles.badgeInfo;
    default:
      return styles.badgeOpen;
  }
}

export function SupportCenter({
  request,
  admin = false,
  defaultCategory = 'technical',
}: {
  request: Request;
  admin?: boolean;
  defaultCategory?: SupportCategory;
}) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<SupportCategory>(defaultCategory);
  const [reply, setReply] = useState('');
  const [internal, setInternal] = useState(false);

  const [filterCategory, setFilterCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState('');
  const [offset, setOffset] = useState(0);

  const [assign, setAssign] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const summary = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const keys = useRef(new Map<string, string>());
  const generation = useRef(0);

  const base = '/api/v1/auth/support/' + (admin ? 'admin/' : '') + 'tickets';

  const api = useCallback(
    async (path: string, init?: RequestInit) => {
      const res = await request(path, init);
      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? 'Request not found.'
            : res.status === 403
              ? 'Your account does not have access to this action.'
              : res.status === 409
                ? 'This request changed or the retry key conflicts. Refresh and review before trying again.'
                : 'Support is unavailable. Your written message has been kept. Please retry.',
        );
      }
      return (await res.json()).data;
    },
    [request],
  );

  const load = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true);
    setError('');
    try {
      const q = new URLSearchParams({ offset: String(offset) });
      if (admin) {
        if (status) q.set('status', status);
        if (priority) q.set('priority', priority);
        if (filterCategory) q.set('category', filterCategory);
        if (search) q.set('search', search);
        if (queue) q.set('queue', queue);
      }
      const list = await api(base + '?' + q);
      if (current === generation.current) setTickets(list);
    } catch (e) {
      if (current === generation.current) setError((e as Error).message);
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [api, base, offset, status, priority, filterCategory, search, queue, admin]);

  useEffect(() => {
    void load();
    return () => {
      generation.current++;
    };
  }, [load]);

  const open = useCallback(
    async (id: string) => {
      setError('');
      try {
        const ticket = await api(base + '/' + id);
        setSelected(ticket);
        setEditStatus(ticket.status);
        setEditPriority(ticket.priority);
        setAssign(ticket.assigned_to_staff_id || '');
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [api, base],
  );

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('ticket');
    if (id && /^[0-9a-f-]{36}$/i.test(id)) void open(id);
  }, [open]);

  const mutation = async (
    path: string,
    payload: Record<string, unknown>,
    method = 'POST',
  ) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError('');
    setNotice('');
    const fingerprint = path + JSON.stringify(payload);
    let key = keys.current.get(fingerprint);
    if (!key) {
      key = crypto.randomUUID();
      keys.current.set(fingerprint, key);
    }
    try {
      const data = await api(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          method === 'PATCH' ? payload : { ...payload, requestId: key },
        ),
      });
      keys.current.delete(fingerprint);
      return data;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      busy.current = false;
      setPending(false);
    }
  };

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (subject.trim().length < 3) {
      errors.subject = 'Enter a subject of at least 3 characters.';
    }
    if (body.trim().length < 10) {
      errors.body = 'Describe your request in at least 10 characters.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setTimeout(() => summary.current?.focus(), 0);
      return;
    }
    const data = await mutation(base, { category, subject, body });
    if (data) {
      setSubject('');
      setBody('');
      setNotice(
        'Request ' +
        data.ticket_number +
        ' received. An email acknowledgement is queued.',
      );
      await open(data.id);
      await load();
    }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    const data = await mutation(base + '/' + selected.id + '/replies', {
      body: reply,
      ...(admin ? { internal } : {}),
    });
    if (data) {
      setReply('');
      setNotice(internal ? 'Internal note saved.' : 'Reply sent.');
      await open(selected.id);
      await load();
    }
  }

  async function copySupportEmail() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SUPPORT_EMAIL);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  }

  const field = (
    name: string,
    label: string,
    value: string,
    onChange: (s: string) => void,
    max: number,
    multiline = false,
  ) => {
    const props = {
      id: 'support-' + name,
      value,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => onChange(e.target.value),
      maxLength: max,
      required: true,
      'aria-invalid': !!fieldErrors[name],
      'aria-describedby': fieldErrors[name]
        ? 'support-error-' + name
        : undefined,
      disabled: pending,
    };
    return (
      <label>
        <span className={styles.fieldLabel}>{label}</span>
        {multiline ? <textarea {...props} rows={5} /> : <input {...props} />}
        {fieldErrors[name] && (
          <span id={'support-error-' + name} className={styles.fieldError}>
            {fieldErrors[name]}
          </span>
        )}
      </label>
    );
  };

  return (
    <section className={styles.root} aria-busy={pending}>
      <header className={styles.header}>
        <div>
          <h1>{admin ? 'Support Center' : 'Help & Support'}</h1>
          <p className={styles.subtitle}>
            {admin
              ? 'Triage requests and reply to customers. Internal notes stay private.'
              : 'Ask for help, track active tickets, or email our support desk directly.'}
          </p>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.contactMeta}>
            <span className={styles.contactLabel}>
              {admin ? 'Active staff support inbox' : 'Direct support email'}
            </span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.contactEmail}>
              {SUPPORT_EMAIL}
            </a>
          </div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => void copySupportEmail()}
            aria-label="Copy support email address"
          >
            {copiedEmail ? 'Copied' : 'Copy email'}
          </button>
        </div>
      </header>

      {error && (
        <div role="alert" className={styles.alertError}>
          <p>{error}</p>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => void load()}
            disabled={pending}
          >
            Retry list
          </button>
        </div>
      )}

      {notice && (
        <p role="status" className={styles.alertNotice}>
          {notice}
        </p>
      )}

      <div className={styles.layout}>
        <div className={styles.column}>
          {admin && (
            <form
              className={styles.filters}
              onSubmit={(e) => {
                e.preventDefault();
                setOffset(0);
                void load();
              }}
            >
              <label>
                Ticket number
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="#01"
                  maxLength={40}
                />
              </label>
              <label>
                Queue
                <select
                  value={queue}
                  onChange={(e) => {
                    setQueue(e.target.value);
                    setOffset(0);
                  }}
                >
                  <option value="">All</option>
                  {['new', 'assigned', 'waiting', 'resolved'].map((s) => (
                    <option key={s} value={s}>
                      {readable(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setOffset(0);
                  }}
                >
                  <option value="">All</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {readable(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setOffset(0);
                  }}
                >
                  <option value="">All</option>
                  {categories.map((s) => (
                    <option key={s} value={s}>
                      {categoryLabels[s] ?? readable(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    setOffset(0);
                  }}
                >
                  <option value="">All</option>
                  {['low', 'medium', 'high', 'urgent'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className={styles.primaryButton}>
                Search
              </button>
            </form>
          )}

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>{admin ? 'Requests' : 'My requests'}</h2>
              <span className={styles.countMeta}>
                {loading ? 'Loading...' : `${tickets.length} shown`}
              </span>
            </div>

            {loading ? (
              <p role="status" className={styles.mutedText}>
                Loading requests...
              </p>
            ) : tickets.length === 0 ? (
              <p className={styles.emptyState}>
                {admin
                  ? 'No support requests match the current filters.'
                  : 'No requests found yet. Submit a new request below or email support@crimfig.com.'}
              </p>
            ) : (
              <ul className={styles.list}>
                {tickets.map((t) => (
                  <li key={t.id}>
                    <a
                      href={'?ticket=' + t.id}
                      aria-current={selected?.id === t.id ? 'page' : undefined}
                      className={
                        selected?.id === t.id
                          ? `${styles.ticketLink} ${styles.ticketLinkActive}`
                          : styles.ticketLink
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        void open(t.id);
                      }}
                    >
                      <div className={styles.ticketTop}>
                        <strong className={styles.ticketTitle}>
                          <span className={styles.ticketRef}>
                            {t.ticket_number}
                          </span>{' '}
                          {t.subject}
                        </strong>
                        <span
                          className={`${styles.badge} ${statusBadgeClass(t.status)}`}
                        >
                          {readable(t.status)}
                        </span>
                      </div>
                      <span className={styles.ticketMeta}>
                        {categoryLabels[t.category] ?? readable(t.category)} ·{' '}
                        {new Date(t.updated_at).toLocaleString()}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={offset === 0 || loading}
                onClick={() => setOffset((n) => Math.max(0, n - 50))}
              >
                Previous
              </button>
              <span className={styles.mutedText}>Page {offset / 50 + 1}</span>
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={tickets.length < 50 || loading}
                onClick={() => setOffset((n) => n + 50)}
              >
                Next
              </button>
            </div>
          </div>

          {!admin && (
            <form onSubmit={create} noValidate className={styles.formCard}>
              <h2>New request</h2>
              {Object.keys(fieldErrors).length > 0 && (
                <div
                  ref={summary}
                  tabIndex={-1}
                  role="alert"
                  className={styles.alertError}
                >
                  {Object.entries(fieldErrors).map(([key, message]) => (
                    <p key={key}>
                      <a href={'#support-' + key}>{message}</a>
                    </p>
                  ))}
                </div>
              )}
              <label>
                <span className={styles.fieldLabel}>Category</span>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as SupportCategory)
                  }
                  disabled={pending}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabels[c] ?? readable(c)}
                    </option>
                  ))}
                </select>
              </label>
              {field('subject', 'Subject', subject, setSubject, 200)}
              {field('body', 'Description', body, setBody, 10000, true)}
              <p className={styles.helperText}>
                Updates are sent to your verified account email and handled by{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                Attachments are not available.
              </p>
              <button
                disabled={pending}
                type="submit"
                className={styles.primaryButton}
              >
                {pending ? 'Sending...' : 'Send request'}
              </button>
            </form>
          )}
        </div>

        <div className={styles.column}>
          {selected ? (
            <article className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h2>
                  <span className={styles.ticketRef}>
                    {selected.ticket_number}
                  </span>{' '}
                  {selected.subject}
                </h2>
                <span
                  className={`${styles.badge} ${statusBadgeClass(selected.status)}`}
                >
                  {readable(selected.status)}
                </span>
              </div>
              <p className={styles.detailMeta}>
                Category:{' '}
                {categoryLabels[selected.category] ??
                  readable(selected.category)}{' '}
                · Last update:{' '}
                {new Date(selected.updated_at).toLocaleString()}
              </p>

              <ol className={styles.thread}>
                {selected.messages?.map((m) => (
                  <li
                    key={m.id}
                    className={
                      m.is_internal_note
                        ? styles.note
                        : m.is_staff_reply
                          ? styles.staffMessage
                          : styles.message
                    }
                  >
                    <div className={styles.messageHeader}>
                      <strong>
                        {m.is_internal_note
                          ? 'Internal note'
                          : m.is_staff_reply
                            ? 'Support'
                            : 'Customer'}
                      </strong>
                      <time dateTime={m.created_at}>
                        {new Date(m.created_at).toLocaleString()}
                      </time>
                    </div>
                    <p>{m.body}</p>
                  </li>
                ))}
              </ol>

              {admin && (
                <form
                  className={styles.manageForm}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const data = await mutation(
                      base + '/' + selected.id,
                      {
                        status: editStatus,
                        priority: editPriority,
                        ...(assign ? { assignedTo: assign } : { unassign: true }),
                      },
                      'PATCH',
                    );
                    if (data) {
                      await open(selected.id);
                      await load();
                    }
                  }}
                >
                  <h3>Manage request</h3>
                  <label>
                    <span className={styles.fieldLabel}>Status</span>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option value={s} key={s}>
                          {readable(s)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className={styles.fieldLabel}>Priority</span>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      {['low', 'medium', 'high', 'urgent'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className={styles.fieldLabel}>
                      Assigned staff UUID (blank to unassign)
                    </span>
                    <input
                      value={assign}
                      onChange={(e) => setAssign(e.target.value)}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pending}
                    className={styles.secondaryButton}
                  >
                    Save changes
                  </button>
                </form>
              )}

              {admin || !['resolved', 'closed'].includes(selected.status) ? (
                <form onSubmit={sendReply} className={styles.replyForm}>
                  {admin && (
                    <label>
                      <span className={styles.fieldLabel}>
                        Message visibility
                      </span>
                      <select
                        value={internal ? 'internal' : 'public'}
                        onChange={(e) =>
                          setInternal(e.target.value === 'internal')
                        }
                      >
                        <option value="public">
                          Public reply — visible to customer
                        </option>
                        <option value="internal">
                          Internal note — staff only
                        </option>
                      </select>
                    </label>
                  )}
                  <label>
                    <span className={styles.fieldLabel}>
                      {internal ? 'Internal note' : 'Reply'}
                    </span>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      maxLength={10000}
                      required
                      rows={5}
                      disabled={pending}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pending || !reply.trim()}
                    className={styles.primaryButton}
                  >
                    {pending
                      ? 'Sending...'
                      : internal
                        ? 'Save internal note'
                        : 'Send reply'}
                  </button>
                </form>
              ) : (
                <p className={styles.closedNotice}>
                  This request is {readable(selected.status)}. You can review
                  the conversation, start a new request, or email{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                </p>
              )}

              {admin && (
                <details className={styles.auditDetails}>
                  <summary>Audit trail</summary>
                  <ul>
                    {selected.audit?.map((a, i) => (
                      <li key={i}>
                        {a.action} · {a.actor_id} ·{' '}
                        {new Date(a.created_at).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </article>
          ) : (
            <div className={styles.detailPlaceholder}>
              <h2>Conversation</h2>
              <p className={styles.mutedText}>
                Select a request from your list to read replies and follow up,
                or email{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
