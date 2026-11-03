"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Textarea } from "../ui";
import { sessionFetch } from "@/lib/session";

export function WebsitePolicyReview({ websiteId, currentPolicy, onSaved }: {
  websiteId: string; currentPolicy: string; onSaved: () => void;
}) {
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const busy = useRef(false), live = useRef(true);
  useEffect(() => { live.current = true; return () => { live.current = false; }; }, []);
  const valid = ["approved", "rejected", "testing"].includes(decision) && reason.trim().length >= 10 && reason.length <= 1000 && confirmed;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy.current || !valid) return;
    busy.current = true; setPending(true); setError(""); setMessage("");
    try {
      const response = await sessionFetch(`/api/v1/admin/ads/websites/${websiteId}/policy`, {
        method: "POST", body: JSON.stringify({ decision, reason: reason.trim() }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw Error(`Website review failed (HTTP ${response.status}). Request: ${response.headers.get("x-request-id") || "unavailable"}`);
      const json = await response.json();
      if (json?.data?.id !== websiteId || json?.data?.policyStatus !== decision) throw Error("The server did not confirm this website review. Refresh before retrying.");
      if (live.current) { setMessage(`Review saved: ${decision}. Approval does not activate a slot or guarantee a paid ad.`); onSaved(); }
    } catch (e) { if (live.current) setError(e instanceof Error ? e.message : "Website review unavailable"); }
    finally { busy.current = false; if (live.current) setPending(false); }
  }
  const prefix = `website-review-${websiteId}`;
  return <section id="website-suitability-review" className="cf-surface cf-dialog-section" aria-label="Website suitability review">
    <h2 className="cf-section-title">Website suitability review</h2>
    <p className="cf-muted">Current policy: {currentPolicy}. DNS verifies ownership; this staff decision determines suitability for paid advertiser ads.</p>
    <form onSubmit={submit} className="cf-section">
      <fieldset disabled={pending} className="cf-section">
        <div className="cf-form-group"><label className="cf-form-label" htmlFor={`${prefix}-decision`}>Review decision</label>
          <select id={`${prefix}-decision`} value={decision} onChange={e => setDecision(e.target.value)} required>
            <option value="">Choose a decision</option><option value="approved">Approve for paid advertiser ads</option><option value="rejected">Reject</option><option value="testing">Keep in testing</option>
          </select>
        </div>
        <div className="cf-form-group"><label className="cf-form-label" htmlFor={`${prefix}-reason`}>Review reason (10–1,000 characters)</label>
          <Textarea id={`${prefix}-reason`} value={reason} onChange={e => setReason(e.target.value)} minLength={10} maxLength={1000} required />
        </div>
        <label className="cf-form-label"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} required /> I have reviewed this website’s suitability and confirm this decision.</label>
        <Button type="submit" disabled={pending || !valid}>{pending ? "Saving review…" : "Save suitability review"}</Button>
      </fieldset>
      {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    </form>
  </section>;
}
