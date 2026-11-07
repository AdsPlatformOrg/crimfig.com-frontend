import React from 'react';

/** Reads only recorded fields. Legacy decisions retain unknown stage values. */
export function DeliveryEvaluation({ decision }: { decision: any }) {
  const entries = [...(Array.isArray(decision.excludedCandidates) ? decision.excludedCandidates : []),
    ...(Array.isArray(decision.evaluatedCandidates) ? decision.evaluatedCandidates : [])];
  const evaluation = entries.find(entry => entry?.deliveryEvaluation)?.deliveryEvaluation;
  if (!evaluation || typeof evaluation !== 'object') return <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Device classification and stage counts were not recorded for this decision.</p>;
  const stages = [['discovered', 'Discovered'], ['targetingEligible', 'Passed targeting'], ['creativeCompatible', 'Compatible creatives'],
    ['auctionEntered', 'Entered auction'], ['eligibleGroups', 'Eligible advertiser groups']];
  const devices = ['desktop', 'android', 'ios', 'tablet'];
  const sources: Record<string, string> = { user_agent: 'User agent', request_context: 'Request context', unknown: 'Unknown' };
  return <section aria-label="Recorded delivery evaluation" style={{ marginTop: '12px', fontSize: '12px' }}>
    <p>Recorded device — {devices.includes(evaluation.device) ? evaluation.device : 'Unknown'} · {sources[evaluation.deviceSource] || 'Unknown source'}</p>
    <p>Recorded auction policy — {typeof evaluation.auctionPolicyVersion === 'string' ? evaluation.auctionPolicyVersion : 'Unknown'}</p>
    <dl style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
      {stages.map(([key, label]) => <div key={key}><dt>{label}</dt><dd style={{ margin: 0, fontWeight: 600 }}>
        {Number.isSafeInteger(evaluation.counts?.[key]) && evaluation.counts[key] >= 0 ? evaluation.counts[key] : 'Unknown'}
      </dd></div>)}
    </dl>
    {Array.isArray(evaluation.preAuctionExclusions) && evaluation.preAuctionExclusions.length > 0 && <details>
      <summary>Targeting and compatibility rejections ({evaluation.preAuctionExclusions.length})</summary>
      <ul>{evaluation.preAuctionExclusions.map((entry: any, index: number) => <li key={index}>
        {entry.campaignId} / {entry.creativeId} — {entry.reasonCode} ({entry.stage})
      </li>)}</ul>
    </details>}
    {Number.isSafeInteger(evaluation.omittedPreAuctionExclusions) && evaluation.omittedPreAuctionExclusions > 0 &&
      <p>{evaluation.omittedPreAuctionExclusions} additional targeting or compatibility rejections omitted from this summary.</p>}
  </section>;
}
