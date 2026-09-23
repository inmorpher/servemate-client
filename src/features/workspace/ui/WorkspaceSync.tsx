'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { workspaceApiClient, workspaceQueryKey } from '../api/client';
import { useUpdateWorkspace, useWorkspaceBootstrap } from '../hooks/useWorkspace';
import { useWorkspaceSyncStore } from '../store/useWorkspaceSyncStore';
import type { WorkspaceSettings } from '../types';

const WORKSPACE_SAVE_DELAY = 500;

export const WorkspaceSync = () => {
	const { data } = useWorkspaceBootstrap();
	const workspaceSettings = data?.workspace.settings;
	const hasWorkspaceData = Boolean(data);
	const queryClient = useQueryClient();
	const { mutate: updateWorkspace, mutateAsync: updateWorkspaceAsync } = useUpdateWorkspace();
	const tabs = useTabs((state) => state.tabs);
	const activeTabId = useTabs((state) => state.activeTabId);
	const hydrateWorkspace = useTabs((state) => state.hydrateWorkspace);
	const setSyncStatus = useWorkspaceSyncStore((state) => state.setStatus);
	const markSynced = useWorkspaceSyncStore((state) => state.markSynced);
	const setRetry = useWorkspaceSyncStore((state) => state.setRetry);
	const hydratedRef = useRef(false);
	const skipNextSaveRef = useRef(false);
	const settingsRef = useRef<WorkspaceSettings>({});

	useEffect(() => {
		setRetry(async () => {
			setSyncStatus('syncing');
			try {
				const latest = await queryClient.fetchQuery({
					queryKey: workspaceQueryKey,
					queryFn: workspaceApiClient.getBootstrap,
					staleTime: 0,
				});
				const current = useTabs.getState();
				await updateWorkspaceAsync({
					tabs: current.tabs.map((tab, order) => ({
						id: tab.id,
						title: tab.title,
						type: tab.entity,
						state: tab.filters,
						pinned: tab.pinned,
						order,
					})),
					activeTabId: current.activeTabId || undefined,
					settings: latest.workspace.settings ?? {},
				});
				settingsRef.current = latest.workspace.settings ?? {};
				markSynced(Date.now());
			} catch {
				setSyncStatus('error');
			}
		});
		return () => setRetry(null);
	}, [markSynced, queryClient, setRetry, setSyncStatus, updateWorkspaceAsync]);

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
		if (!data?.activeTab) {
			return;
		}

		if (
			data.activeTabData !== undefined &&
			(data.activeTab.type === 'users' || data.activeTab.type === 'orders')
		) {
			queryClient.setQueryData(
				[data.activeTab.type, data.activeTab.state ?? {}],
				data.activeTabData,
			);
		}

		if (data.activeTab.type === 'users' && data.activeTabMeta) {
			queryClient.setQueryData(['users', 'meta'], data.activeTabMeta);
		}
	}, [data, queryClient]);

	useEffect(() => {
		settingsRef.current = workspaceSettings ?? {};
	}, [workspaceSettings]);

	useEffect(() => {
		if (!hasWorkspaceData || !hydratedRef.current) {
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
					settings: settingsRef.current,
				},
				{
					onSuccess: () => markSynced(Date.now()),
					onError: () => setSyncStatus('error'),
				},
			);
		}, WORKSPACE_SAVE_DELAY);

		return () => window.clearTimeout(timeoutId);
	}, [activeTabId, hasWorkspaceData, markSynced, setSyncStatus, tabs, updateWorkspace]);

	return null;
};
