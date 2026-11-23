"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { sessionFetch } from "@/lib/session";
import { Button, Card, CardContent, Input, Badge } from "../ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
type Role = { key: string; label: string; scopes: string[] };
type Proposal = {
  id: string;
  target_user_id: string;
  role_key: string;
  scope: string;
  action: string;
  reason: string;
  requested_by: string;
  state: string;
  expires_at: string;
};
type Overview = {
  actorId: string;
  roles: Role[];
  grants: {
    id: string;
    user_id: string;
    role_key: string;
    scope: string;
    state: string;
    account_status: string;
    mfa_enabled: boolean;
    expires_at: string | null;
  }[];
  requests: Proposal[];
  audit: {
    id: string;
    target_user_id: string;
    role_key: string;
    scope: string;
    action: string;
    reason: string;
    created_at: string;
  }[];
};
const endpoint = "/api/v1/auth/platform-access";
function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <span className="cf-form-label">{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label={label}>
            {options.find((option) => option.value === value)?.label ??
              "Choose"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
export function PlatformAccessView() {
  const [data, setData] = useState<Overview>(),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [target, setTarget] = useState(""),
    [role, setRole] = useState("super_admin"),
    [scope, setScope] = useState("auth"),
    [action, setAction] = useState("grant"),
    [reason, setReason] = useState(""),
    [code, setCode] = useState(""),
    [reviewCodes, setReviewCodes] = useState<Record<string, string>>({});
  const generation = useRef(0),
    pending = useRef<{ id: string; fingerprint: string } | undefined>(
      undefined,
    ),
    busyRef = useRef(false);
  const load = useCallback(async () => {
    const ticket = ++generation.current;
    try {
      const res = await sessionFetch(endpoint, { cache: "no-store" });
      if (!res.ok)
        throw Error(
          "Platform access is unavailable or this account does not have permission.",
        );
      const body = await res.json();
      if (
        body.status !== "success" ||
        !Array.isArray(body.data?.grants) ||
        !Array.isArray(body.data?.roles)
      )
        throw Error("Platform access response is unavailable.");
      if (ticket === generation.current) setData(body.data);
    } catch (e) {
      if (ticket === generation.current)
        setError(e instanceof Error ? e.message : "Unable to load access");
    }
  }, []);
  useEffect(() => {
    void load();
    return () => {
      generation.current++;
    };
  }, [load]);
  async function send(path: string, body: unknown) {
    const res = await sessionFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    if (!res.ok || result.status !== "success")
      throw Error(
        typeof result.message === "string"
          ? result.message
          : "Request was not confirmed. Refresh to check its status before retrying.",
      );
    return result.data;
  }
  async function propose(e: React.FormEvent) {
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    const details = {
        targetUserId: target.trim(),
        roleKey: role,
        scope,
        action,
        reason: reason.trim(),
      },
      fingerprint = JSON.stringify(details);
    if (!pending.current || pending.current.fingerprint !== fingerprint)
      pending.current = { id: crypto.randomUUID(), fingerprint };
    try {
      await send(endpoint + "/proposals", {
        ...details,
        code,
        requestId: pending.current.id,
      });
      pending.current = undefined;
      setReason("");
      setMessage(
        "Proposal recorded. A different Platform Admin must review it within 15 minutes.",
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Proposal was not confirmed");
    } finally {
      setCode("");
      busyRef.current = false;
      setBusy(false);
    }
  }
  async function decide(proposal: Proposal, decision: "approve" | "reject") {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await send(endpoint + "/proposals/" + proposal.id + "/decision", {
        decision,
        code: reviewCodes[proposal.id] || "",
      });
      setMessage(
        decision === "approve"
          ? "Access change approved."
          : "Proposal rejected.",
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decision was not confirmed");
    } finally {
      setReviewCodes((values) => ({ ...values, [proposal.id]: "" }));
      busyRef.current = false;
      setBusy(false);
    }
  }
  const roles = data?.roles ?? [],
    selected = roles.find((item) => item.key === role);
  return (
    <section
      aria-labelledby="platform-access-heading"
      className="tw:grid tw:gap-6"
    >
      <header>
        <h1 id="platform-access-heading">Platform access</h1>
        <p>
          Manage staff access with independent review and an audited history.
        </p>
      </header>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <div>
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => {
            setError("");
            void load();
          }}
        >
          Refresh access
        </Button>
      </div>
      {!data && !error && <p role="status">Loading platform access…</p>}
      {data && (
        <>
          <Card>
            <CardContent className="tw:grid tw:gap-4 tw:p-4">
              <h2>Propose an access change</h2>
              <p>
                Both administrators need MFA. Use a fresh authenticator code.
                New or reset authenticators follow the existing security
                cooldown. No change takes effect until another administrator
                approves.
              </p>
              <form onSubmit={propose} className="tw:grid tw:gap-4">
                <label>
                  Account ID
                  <Input
                    required
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    autoComplete="off"
                    placeholder="Existing account UUID"
                  />
                </label>
                <div className="tw:flex tw:flex-wrap tw:gap-4">
                  <Choice
                    label="Role"
                    value={role}
                    options={roles.map((item) => ({
                      value: item.key,
                      label: item.label,
                    }))}
                    onChange={(value) => {
                      setRole(value);
                      const item = roles.find((item) => item.key === value);
                      if (item && !item.scopes.includes(scope))
                        setScope(item.scopes[0]);
                    }}
                  />
                  <Choice
                    label="Service scope"
                    value={scope}
                    options={(selected?.scopes ?? []).map((value) => ({
                      value,
                      label:
                        value === "auth_finance"
                          ? "Independent financial review"
                          : value,
                    }))}
                    onChange={setScope}
                  />
                  <Choice
                    label="Change"
                    value={action}
                    options={[
                      { value: "grant", label: "Grant access" },
                      { value: "revoke", label: "Revoke access" },
                    ]}
                    onChange={setAction}
                  />
                </div>
                <label>
                  Reason
                  <Input
                    required
                    minLength={3}
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <label>
                  Fresh authenticator code
                  <Input
                    required
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoComplete="off"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </label>
                <div>
                  <Button disabled={busy || !roles.length} type="submit">
                    {busy ? "Saving…" : "Create proposal"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="tw:grid tw:gap-4 tw:p-4">
              <h2>Latest access proposals</h2>
              {!data.requests.length && (
                <p>No access changes have been proposed.</p>
              )}
              {data.requests.map((proposal) => {
                const expired =
                    new Date(proposal.expires_at).getTime() <= Date.now(),
                  canReview =
                    proposal.state === "pending" &&
                    !expired &&
                    proposal.requested_by !== data.actorId;
                return (
                  <article
                    key={proposal.id}
                    className="tw:grid tw:gap-2 tw:border-b tw:pb-4"
                  >
                    <h3>
                      {proposal.action === "grant" ? "Grant" : "Revoke"}{" "}
                      {roles.find((role) => role.key === proposal.role_key)
                        ?.label ?? proposal.role_key}{" "}
                      · {proposal.scope}
                    </h3>
                    <p className="tw:break-all">
                      Account {proposal.target_user_id}
                    </p>
                    <p>{proposal.reason}</p>
                    <div>
                      <Badge variant="outline">
                        {proposal.state === "pending" && expired
                          ? "Expired"
                          : proposal.state}
                      </Badge>
                    </div>
                    <p>
                      Review deadline:{" "}
                      {new Date(proposal.expires_at).toLocaleString()}
                    </p>
                    {canReview ? (
                      <>
                        <label>
                          Fresh review authenticator code
                          <Input
                            type="password"
                            inputMode="numeric"
                            maxLength={6}
                            autoComplete="off"
                            aria-label={"Review code for " + proposal.id}
                            value={reviewCodes[proposal.id] ?? ""}
                            onChange={(e) =>
                              setReviewCodes((values) => ({
                                ...values,
                                [proposal.id]: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <div className="tw:flex tw:flex-wrap tw:gap-2">
                          <Button
                            disabled={
                              busy ||
                              !/^\d{6}$/.test(reviewCodes[proposal.id] ?? "")
                            }
                            onClick={() => void decide(proposal, "approve")}
                          >
                            Approve exact change
                          </Button>
                          <Button
                            variant="outline"
                            disabled={
                              busy ||
                              !/^\d{6}$/.test(reviewCodes[proposal.id] ?? "")
                            }
                            onClick={() => void decide(proposal, "reject")}
                          >
                            Reject proposal
                          </Button>
                        </div>
                      </>
                    ) : (
                      proposal.state === "pending" &&
                      !expired && (
                        <p>
                          A different Platform Admin must review your proposal.
                        </p>
                      )
                    )}
                  </article>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="tw:grid tw:gap-3 tw:p-4">
              <h2>Latest staff assignments</h2>
              <p>
                Showing up to 200 assignments. Account status, expiry and
                revocation still apply.
              </p>
              {data.grants.map((grant) => (
                <article key={grant.id} className="tw:border-b tw:pb-3">
                  <h3>
                    {roles.find((role) => role.key === grant.role_key)?.label ??
                      grant.role_key}{" "}
                    · {grant.scope}
                  </h3>
                  <p className="tw:break-all">{grant.user_id}</p>
                  <p>
                    {grant.state} · Account {grant.account_status} · MFA{" "}
                    {grant.mfa_enabled ? "enrolled" : "not enrolled"}
                    {grant.expires_at
                      ? " · Expires " +
                        new Date(grant.expires_at).toLocaleString()
                      : ""}
                  </p>
                </article>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="tw:grid tw:gap-3 tw:p-4">
              <h2>Latest audit events</h2>
              {data.audit.map((event) => (
                <article key={event.id} className="tw:border-b tw:pb-3">
                  <p>
                    {event.action} · {event.role_key} · {event.scope}
                  </p>
                  <p>{event.reason}</p>
                  <p>{new Date(event.created_at).toLocaleString()}</p>
                </article>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
