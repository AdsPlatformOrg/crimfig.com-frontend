export interface DeliveryReadinessGateStatus {
  status: string;
}

const passingStatuses = new Set(['eligible', 'observed']);

export function isPassingReadinessStatus(status: string) {
  return passingStatuses.has(status);
}

export function summarizeDeliveryReadiness(gates: readonly DeliveryReadinessGateStatus[]) {
  const passing = gates.filter(gate => isPassingReadinessStatus(gate.status)).length;
  const needsAttention = gates.length - passing;
  const blocked = gates.filter(gate => gate.status === 'blocked' || gate.status === 'action_required').length;

  if (gates.length === 0) {
    return { passing, needsAttention, blocked, label: 'No visible readiness checks', tone: 'neutral' as const };
  }
  if (blocked > 0) {
    return {
      passing,
      needsAttention,
      blocked,
      label: `${blocked} check${blocked === 1 ? '' : 's'} blocked`,
      tone: 'blocked' as const,
    };
  }
  if (needsAttention > 0) {
    return {
      passing,
      needsAttention,
      blocked,
      label: `${needsAttention} check${needsAttention === 1 ? '' : 's'} need attention`,
      tone: 'attention' as const,
    };
  }
  return { passing, needsAttention, blocked, label: 'All evaluated checks pass', tone: 'passing' as const };
}
