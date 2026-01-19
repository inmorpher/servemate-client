export type TabFilterValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<string | number | boolean | null | undefined>;

export type TabFilters = Record<string, TabFilterValue>;

type CanonicalizeOptions = {
	ignoreKeys?: string[];
};

export const canonicalizeFilters = (
	filters?: TabFilters,
	options?: CanonicalizeOptions,
): string => {
	if (!filters) return '';

	const ignore = new Set(options?.ignoreKeys ?? []);
	const keys = Object.keys(filters)
		.filter((k) => !ignore.has(k))
		.sort();

	const params = new URLSearchParams();

	for (const key of keys) {
		const raw = filters[key];

		if (raw === null || raw === undefined) {
			continue;
		}
		const values = Array.isArray(raw) ? raw : [raw];

		const normalized = values
			.filter((v) => v !== null && v !== undefined && String(v) !== '')
			.map((v) => String(v))
			.sort();

		if (normalized.length === 0) {
			continue;
		}

		for (const v of normalized) {
			params.append(key, v);
		}
	}

	return params.toString();
};

export const makeTabId = (entity: string, filters?: TabFilters): string => {
	const canon = canonicalizeFilters(filters, { ignoreKeys: ['activeTab'] });
	return canon ? `${entity}::${canon}` : entity;
};
