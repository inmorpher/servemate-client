import type { components } from '@/shared/api/openapi-types';

export type Order = components['schemas']['OrderSchema'];
export type OrdersResponse = components['schemas']['OrdersResponse'];
export type OrderStatus = NonNullable<Order['status']>;

export interface OrderListItem extends Order {}
