'use client';

import { useGetOrdersMeta } from '@/features/orders/hooks/useGetOrdersMeta';
import { useState } from 'react';
import { FilterDateRange } from './FilterDateRange';

export default function DatePickerPage() {
	const { data: metaData } = useGetOrdersMeta();

	console.log('metaData', metaData);

	const [range, setRange] = useState<{ from: string | undefined; to: string | undefined }>({
		from: undefined,
		to: undefined,
	});

	const min = metaData?.dates?.min
		? new Date(metaData.dates.min).toISOString().split('T')[0]
		: undefined;

	const max = metaData?.dates?.max
		? new Date(metaData.dates.max).toISOString().split('T')[0]
		: undefined;

	const activeFilters = () => {
		const items: { id: string; label: string; onRemove?: () => void }[] = [];

		if (range.from) {
			items.push({
				id: 'date-from',
				label: `From: ${range.from}`,
				onRemove: () => setRange((prev) => ({ ...prev, from: undefined })),
			});
		}

		if (range.to) {
			items.push({
				id: 'date-to',
				label: `To: ${range.to}`,
				onRemove: () => setRange((prev) => ({ ...prev, to: undefined })),
			});
		}

		return items;
	};

	return (
		<FilterDateRange from={range.from} to={range.to} min={min} max={max} onChange={setRange} />
	);
}
