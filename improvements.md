# Улучшения проекта ServeMate

## 1. Консолидация хуков useGetOrders и useGetOrdersMeta
**Описание**: В `OrderFilters.tsx` используется два хука с пересекающейся логикой парсинга критериев поиска. Это приводит к дублированию и потенциальным несоответствиям. Рекомендуется объединить в один `useOrderSearch` хук для единообразия и избежания ошибок синхронизации.

**Пример реализации**:
```typescript
// src/features/orders/hooks/useOrderSearch.ts
export const useOrderSearch = () => {
  const orderSearchCriteria = useSearchCriteria({
    schema: OrderSearchSchema,
    numberFields: ['id', 'page', 'pageSize', 'minAmount', 'maxAmount'],
    arrayFields: ['status', 'allergies'],
  });

  const ordersData = useQuery({ /* ... */ });
  const ordersMeta = useQuery({ /* ... */ });

  return { orderSearchCriteria, updateSearchCriteria, ordersData, ordersMeta };
};
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 15-20), `src/features/orders/hooks/useGetOrders.ts`, `src/features/orders/hooks/useGetOrdersMeta.ts`.

## 2. Синхронизация локального состояния с URL в OrderFilters
**Описание**: Локальное состояние `searchValue` в `OrderFilters.tsx` не синхронизировано с `orderSearchCriteria.id`, что может привести к расхождениям. Закомментированный `useEffect` не активирован.

**Пример реализации**:
```typescript
useEffect(() => {
  setSearchValue(orderSearchCriteria.id?.toString() ?? '');
}, [orderSearchCriteria.id]);
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 25-27).

## 3. Улучшение парсинга числовых значений в OrderFilters
**Описание**: `Number(searchValue)` без проверки может дать NaN. Использовать `parseInt` с проверкой.

**Пример реализации**:
```typescript
const parsed = searchValue.trim() ? parseInt(searchValue, 10) : undefined;
if (parsed && Number.isFinite(parsed)) {
  updateSearchCriteria({ id: parsed });
}
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строки 50-55).

## 4. Исправление логики диапазона цен в OrderFilters
**Описание**: `minAmount || ordersMeta.filtered.prices.min` может ошибочно использовать fallback при minAmount = 0. Использовать nullish coalescing.

**Пример реализации**:
```typescript
minValue={minAmount ?? ordersMeta.filtered.prices.min}
```

**Файл и строка**: `src/features/orders/ui/OrderFilters.tsx` (строка 75).

## 5. Удаление неиспользуемых зависимостей
**Описание**: В `package.json` установлены `next-auth`, `axios`, `use-debounce`, но они не используются в коде. Это увеличивает размер бандла.

**Пример реализации**:
```bash
npm uninstall next-auth axios use-debounce
```

**Файл и строка**: `package.json` (строки 15, 24, 32).

## 6. Удаление console.log из middleware.ts
**Описание**: В `middleware.ts` много console.log, что плохо для продакшена и может засорять логи.

**Пример реализации**:
Удалить все console.log, заменить на условное логирование в dev-режиме.

**Файл и строка**: `src/middleware.ts` (строки 7-10, 18, 25, 30, 35, 38).

## 7. Удаление console.log из config.ts
**Описание**: В `config.ts` есть console.log для отладки, который не нужен в продакшене.

**Пример реализации**:
Удалить строку `console.log('CONFIG.API_BASE_URL:', CONFIG.API_BASE_URL);`

**Файл и строка**: `src/app/api/service/[...params]/config.ts` (строка 11).

## 8. Добавление логирования в consts.ts для отладки
**Описание**: В `consts.ts` нет логирования для переменных окружения, что затрудняет отладку.

**Пример реализации**:
```typescript
if (process.env.NODE_ENV !== 'production') {
  console.log('API_BASE_URL resolved to:', API_BASE_URL);
}
```

**Файл и строка**: `src/consts.ts` (после строки 3).

## 9. Расширение API_ENDPOINTS в consts.ts
**Описание**: В `API_ENDPOINTS` только два эндпоинта, можно добавить больше для полноты.

**Пример реализации**:
```typescript
export const API_ENDPOINTS = {
  Users: `/api/service/users`,
  Orders: `/api/service/orders`,
  Auth: { Login: `/api/service/auth/login` },
};
```

**Файл и строка**: `src/consts.ts` (строка 5).

## 10. Использование axios вместо fetch в orderApiClient
**Описание**: В `orderApiClient` используется fetch, но установлен axios. Для консистентности можно перейти на axios.

**Пример реализации**:
```typescript
import axios from 'axios';
const response = await axios.get(url);
```

**Файл и строка**: `src/features/orders/api/client.ts` (строки 6-10, 15-19).
