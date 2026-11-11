/** Match the list API's review category without changing delivery state or capabilities. */
export function campaignListStatus(status: string, moderationStatus?: string | null): string {
  if (status !== 'trash' && (moderationStatus === 'pending_primary_review' || moderationStatus === 'pending_manager_approval')) {
    return 'under_review';
  }
  return status;
}
