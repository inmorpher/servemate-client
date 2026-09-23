'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { workspaceApiClient, workspaceQueryKey } from '../api/client';
import { useUpdateWorkspace, useWorkspaceBootstrap } from '../hooks/useWorkspace';
import { useWorkspaceSyncStore } from '../store/useWorkspaceSyncStore';

const WORKSPACE_SAVE_DELAY = 500;

export const WorkspaceSync = () => {
	const { data } = useWorkspaceBootstrap();
	const queryClient = useQueryClient();
	const { mutate: updateWorkspace } = useUpdateWorkspace();
	const tabs = useTabs((state) => state.tabs);
	const activeTabId = useTabs((state) => state.activeTabId);
	const hydrateWorkspace = useTabs((state) => state.hydrateWorkspace);
	const setSyncStatus = useWorkspaceSyncStore((state) => state.setStatus);
	const markSynced = useWorkspaceSyncStore((state) => state.markSynced);
	const setRetry = useWorkspaceSyncStore((state) => state.setRetry);
	const hydratedRef = useRef(false);
	const skipNextSaveRef = useRef(false);

	useEffect(() => {
		setRetry(async () => {
			setSyncStatus('syncing');
			try {
				const latest = await queryClient.fetchQuery({
					queryKey: workspaceQueryKey,
					queryFn: workspaceApiClient.getBootstrap,
				});
				hydrateWorkspace(latest.workspace);
				skipNextSaveRef.current = true;
				markSynced(Date.now());
			} catch {
				setSyncStatus('error');
			}
		});
		return () => setRetry(null);
	}, [hydrateWorkspace, markSynced, queryClient, setRetry, setSyncStatus]);

	useEffect(() => {
		if (!data || hydratedRef.current) {
			return;
		}

		hydrateWorkspace(data.workspace);
		skipNextSaveRef.current = true;
		hydratedRef.current = true;
		markSynced(Date.now());
	}, [data, hydrateWorkspace, markSynced]);

	useEffect(() => {
		if (!data?.activeTab || data.activeTabData === undefined) {
			return;
		}

		if (data.activeTab.type === 'users' || data.activeTab.type === 'orders') {
			queryClient.setQueryData(
				[data.activeTab.type, data.activeTab.state ?? {}],
				data.activeTabData,
			);
		}
	}, [data, queryClient]);

	useEffect(() => {
		if (!data || !hydratedRef.current) {
			return;
		}
		if (skipNextSaveRef.current) {
			skipNextSaveRef.current = false;
			return;
		}

		setSyncStatus('pending');
		const timeoutId = window.setTimeout(() => {
			setSyncStatus('syncing');
			updateWorkspace(
				{
					tabs: tabs.map((tab, order) => ({
						id: tab.id,
						title: tab.title,
						type: tab.entity,
						state: tab.filters,
						pinned: tab.pinned,
						order,
					})),
					activeTabId: activeTabId || undefined,
					settings: data.workspace.settings ?? {},
				},
				{
					onSuccess: () => markSynced(Date.now()),
					onError: () => setSyncStatus('error'),
				},
			);
		}, WORKSPACE_SAVE_DELAY);

		return () => window.clearTimeout(timeoutId);
	}, [activeTabId, data, markSynced, setSyncStatus, tabs, updateWorkspace]);

	return null;
};
