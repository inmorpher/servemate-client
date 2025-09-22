# Search Criteria — Design & Implementation Notes

Документ кратко описывает подход к парсингу, валидации и обновлению URL-criteria для сущностей (orders, users и т.д.) в проекте ServeMate — практический чеклист и примеры кода.

**Цель**

- Централизовать логику работы с query-параметрами: парсинг, валидация, сериализация и навигация.
- Разделить ответственность: один generic hook для критериев, отдельные хуки для данных (list/meta) и утилиты для сериализации и запросов.

**Ключевая идея**

- `useSearchCriteria` — чистый парсер/валидатор (оставляем как есть).
- `useSearchNavigation` — сериализация + безопасный `push/replace` в URL (обёртка над next/navigation).
- `useResourceSearchCriteria` (generic) — single source of truth: использует `useSearchCriteria` + `useSearchNavigation` и даёт методы `updateFilters / setPage / setPageSize / updateSearchCriteria`.
- `useGetX` / `useGetXMeta` — отдельные `useQuery`, читающие критерии из wrapper; разные `staleTime`/политики.
- `buildQueryParams` — универсальная сериализация для URL (CSV для массивов, ISO для Date, JSON для объектов).

**Файлы для правки / добавления**

- Обновить: `src/shared/utils/buildQueryParams.ts`
- Обновить: `src/shared/hooks/useSearchNavigation.ts`
- Добавить: `src/shared/hooks/useResourceSearchCriteria.ts`
- Добавить: `src/features/orders/hooks/useOrderSearchCriteria.ts` (тонкая обёртка)
- Обновить: `src/features/orders/hooks/useGetOrders.ts`
- Обновить: `src/features/orders/hooks/useGetOrdersMeta.ts`
- (Опционально) Добавить: `src/shared/hooks/useApiQuery.ts`

**Утилиты / Примеры кода**

- `buildQueryParams` (заменяет простую реализацию, поддерживает массивы/даты/объекты):

```typescript
export const buildQueryParams = <T extends Record<string, unknown>>(criteria: T): string => {
	const params = new URLSearchParams();

	Object.entries(criteria).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') return;

		if (Array.isArray(value)) {
			const filtered = value.filter((v) => v !== undefined && v !== null && v !== '');
			if (filtered.length === 0) return;
			params.set(key, filtered.join(',')); // CSV
			return;
		}

		if (value instanceof Date) {
			params.set(key, value.toISOString());
			return;
		}

		if (typeof value === 'object') {
			try {
				params.set(key, JSON.stringify(value));
			} catch {
				/* skip */
			}
			return;
		}

		params.set(key, String(value));
	});

	return params.toString();
};
```

- `useSearchNavigation` (улучшенная версия):

```typescript
'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';

export const useSearchNavigation = <
	T extends Record<string, unknown> = Record<string, unknown>,
>() => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const buildFrom = (obj: Record<string, unknown>) => {
		const qs = buildQueryParams(obj as T);
		return `${pathname}${qs ? `?${qs}` : ''}`;
	};

	type Updater = Partial<T> | ((current: T) => Partial<T>);

	const updateSearchCriteria = useCallback(
		(patch: Updater, opts?: { current?: T; replace?: boolean }) => {
			const current =
				(opts?.current as Record<string, unknown>) ?? Object.fromEntries(searchParams.entries());
			const resolved =
				typeof patch === 'function'
					? (patch(current as T) as Record<string, unknown>)
					: (patch as Record<string, unknown>);
			const merged = { ...current, ...resolved };
			const url = buildFrom(merged);
			if (opts?.replace) router.replace(url);
			else router.push(url);
		},
		[router, pathname, searchParams]
	);

	return { updateSearchCriteria };
};
```

- `useResourceSearchCriteria` (generic wrapper):

```typescript
import { useMemo } from 'react';
import { ZodSchema, z } from 'zod';
import { useSearchCriteria } from '@/shared/hooks/useSearchCriteria';
import { useSearchNavigation } from '@/shared/hooks/useSearchNavigation';

type Config<T extends ZodSchema> = {
	schema: T;
	numberFields?: string[];
	booleanFields?: string[];
	arrayFields?: string[];
	resetPageOnFilters?: boolean;
};

export const useResourceSearchCriteria = <TSchema extends ZodSchema>(config: Config<TSchema>) => {
	const {
		schema,
		numberFields = [],
		booleanFields = [],
		arrayFields = [],
		resetPageOnFilters = true,
	} = config;

	const parsed = useSearchCriteria({
		schema,
		numberFields,
		booleanFields,
		arrayFields,
	}) as z.infer<TSchema>;
	const { updateSearchCriteria: navigateUpdate } = useSearchNavigation<z.infer<TSchema>>();
	const current = useMemo(() => parsed, [parsed]);

	const updateSearchCriteria = (patch: Partial<z.infer<TSchema>>) =>
		navigateUpdate(patch, { current });
	const updateFilters = (patch: Partial<z.infer<TSchema>>) =>
		navigateUpdate({ ...(patch as any), ...(resetPageOnFilters ? { page: 1 } : {}) }, { current });
	const setPage = (page: number) => navigateUpdate({ page } as any, { current });
	const setPageSize = (pageSize: number) => navigateUpdate({ pageSize } as any, { current });

	return {
		searchCriteria: current as z.infer<TSchema>,
		updateSearchCriteria,
		updateFilters,
		setPage,
		setPageSize,
	};
};
```

- Thin wrapper для orders:

```typescript
import { OrderSearchSchema } from '@servemate/dto';
import { useResourceSearchCriteria } from '@/shared/hooks/useResourceSearchCriteria';

export const useOrderSearchCriteria = () =>
	useResourceSearchCriteria({
		schema: OrderSearchSchema,
		numberFields: ['id', 'page', 'pageSize', 'minAmount', 'maxAmount', 'guestsCount'],
		arrayFields: ['status', 'allergies'],
		resetPageOnFilters: true,
	});
```

- `useGetOrders` / `useGetOrdersMeta` (ключевые изменения):

```typescript
// useGetOrders
const { searchCriteria: orderSearchCriteria, setPage, setPageSize } = useOrderSearchCriteria();
const ordersQuery = useQuery({ queryKey: ['orders', orderSearchCriteria], queryFn: () => orderApiClient.getOrders(orderSearchCriteria), ... });
// expose updatePage/updatePageSize -> setPage/setPageSize

// useGetOrdersMeta
const { searchCriteria: orderSearchCriteria } = useOrderSearchCriteria();
const ordersMeta = useQuery({ queryKey: ['ordersMeta', orderSearchCriteria], queryFn: () => orderApiClient.getMeta(orderSearchCriteria), staleTime: 10*60*1000 });
```

**Как использовать в компонентах**

- `OrderFilters`:
  - `const { searchCriteria, updateFilters } = useOrderSearchCriteria();`
  - `const ordersMetaQuery = useGetOrdersMeta();`
  - При смене фильтра: `updateFilters({ status: 'pending' })` (page сбросится в 1).

- `OrderList`:
  - `const { updatePage, updatePageSize, orderSearchCriteria } = useGetOrders();`
  - `onPageChange = (p) => updatePage(p)`.

**Проверочный чек-лист**

- `npm run dev`
- Открыть страницу заказов `/orders`:
  - фильтры меняют URL и устанавливают `page=1`;
  - пагинация меняет только `page`/`pageSize`, не затрагивая фильтры;
  - мета загружается и кешируется дольше, чем список;
  - переход назад/вперед браузера корректно восстанавливает состояние.

**Рекомендации**

- Валидируй на клиенте (useSearchCriteria) — это улучшает UX и предотвращает ошибок.
- Backend должен также валидировать параметры (не полагаться на клиент).
- Документируй формат массивов (CSV) и согласуй с backend.
- Для новых сущностей делай thin wrapper (`useXSearchCriteria`) над `useResourceSearchCriteria`.

**Дальше (опционально)**

- Добавить `useApiQuery` wrapper для удаления boilerplate `useQuery`.
- Написать unit-tests для `useResourceSearchCriteria` и `useSearchNavigation`.

---

Если хочешь — могу применить патчи прямо сейчас (создать/заменить файлы и обновить хуки). Напиши предпочитаешь ли я применить изменения или дать готовый patch, который ты вставишь сам.
