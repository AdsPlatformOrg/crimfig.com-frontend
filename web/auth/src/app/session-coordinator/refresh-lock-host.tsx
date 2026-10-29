'use client';
import { useEffect } from 'react';
import { installRefreshLockHost } from '@crimfig/session';

export function RefreshLockHost() {
  useEffect(() => installRefreshLockHost(), []);
  return null;
}
