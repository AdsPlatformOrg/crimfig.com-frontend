/** Virtual units only. Never format as USD or funded fig. */
export function formatCfig(value: string | undefined): string {
  if (value === undefined || !/^\d+$/.test(value)) return "Unavailable";
  const amount = BigInt(value),
    whole = amount / 1_000_000n,
    fraction = (amount % 1_000_000n)
      .toString()
      .padStart(6, "0")
      .replace(/0+$/, "");
  return `${whole.toLocaleString("en-US")}${fraction ? "." + fraction : ""} $cfig`;
}

export function houseRewardEligibility(
  site: {
    verificationStatus?: string;
    verificationExpiresAt?: string;
    policyStatus?: string;
    isSuspended?: boolean;
    isActive?: boolean;
  },
  now = Date.now(),
): string {
  if (
    site.isSuspended ||
    site.isActive === false ||
    site.policyStatus === "suspended"
  )
    return "Suspended or inactive: no House rewards.";
  const expiry = Date.parse(site.verificationExpiresAt ?? "");
  if (
    site.verificationStatus !== "verified" ||
    !Number.isFinite(expiry) ||
    expiry <= now
  )
    return "Current ownership verification required; DNS ownership is separate from suitability approval.";
  if (site.policyStatus === "approved")
    return "Approved supply: may qualify for House rewards after program activation, evidence validation and finalization.";
  if (site.policyStatus === "testing")
    return "TESTING: integration and analytics only; earns zero $cfig. Submit for suitability review.";
  if (site.policyStatus === "pending_approval")
    return "Suitability review pending: earns zero $cfig until approved.";
  return "Website policy approval required; earns zero $cfig.";
}

/** Decimal promotional units to exact micro-cfig; never round user input. */
export function parseCfig(value: string): string | null {
  if (!/^(0|[1-9][0-9]{0,11})(\.[0-9]{1,6})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  const units = BigInt(whole) * 1000000n + BigInt(fraction.padEnd(6, "0"));
  return units > 0n ? units.toString() : null;
}
