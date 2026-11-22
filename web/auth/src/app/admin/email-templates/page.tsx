'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthAdminGuard } from '../../../components/AuthAdminGuard';
import { Button, Card } from '../../../components/ui';
import { consentSession } from '../../../lib/consent';
import styles from './email-templates.module.css';

interface EmailPreview {
  id: string;
  name: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
}

function TemplatePreview({ template }: { template: EmailPreview }) {
  return (
    <section className={styles.preview} aria-labelledby="email-preview-title">
      <h2 id="email-preview-title">{template.name}</h2>
      <dl>
        <dt>Subject</dt>
        <dd>{template.subject}</dd>
      </dl>
      {template.htmlContent && (
        <iframe
          className={styles.frame}
          title={`${template.name} HTML preview`}
          sandbox=""
          srcDoc={`<!doctype html><html lang="en"><head><meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
            <style>body { margin: 0; background: white; overflow-wrap: anywhere; }</style>
            </head><body>${template.htmlContent.replace(/\bhref\s*=/gi, 'data-preview-href=')}</body></html>`}
        />
      )}
      {template.textContent && (
        <div>
          <h3>Plain text</h3>
          <p className={styles.plainText}>{template.textContent}</p>
        </div>
      )}
    </section>
  );
}

function EmailTemplateList() {
  const [templates, setTemplates] = useState<EmailPreview[] | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTemplates() {
      try {
        const response = await consentSession().request(
          new URL('/api/v1/admin/email-templates', window.location.origin),
          { headers: { Accept: 'application/json' }, signal: controller.signal },
        );
        if (!response.ok) throw new Error('Email templates unavailable');
        const { data } = await response.json();
        if (!controller.signal.aborted) setTemplates(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }

    void loadTemplates();
    return () => controller.abort();
  }, [attempt]);

  const selected = templates?.find(({ id }) => id === selectedId) ?? templates?.[0];

  return (
    <main className={styles.page}>
      <Button asChild variant="outline"><Link href="/admin">Back to Platform Admin</Link></Button>
      <header>
        <h1>Email Templates</h1>
        <p>Read-only previews using sample data.</p>
      </header>
      {error ? (
        <div>
          <p role="alert">Could not load email templates.</p>
          <Button variant="outline" onClick={() => {
            setError(false);
            setAttempt(attempt + 1);
          }}>Try again</Button>
        </div>
      ) : !templates ? (
        <p role="status">Loading email templates…</p>
      ) : !selected ? (
        <p>No email templates are available.</p>
      ) : (
        <Card className={styles.card}>
          <label htmlFor="email-template">Template</label>
          <select id="email-template" value={selected.id} onChange={(event) => setSelectedId(event.target.value)}>
            {templates.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
          <TemplatePreview template={selected} />
        </Card>
      )}
    </main>
  );
}

export default function EmailTemplatesPage() {
  return <AuthAdminGuard requiredRole="super_admin"><EmailTemplateList /></AuthAdminGuard>;
}
