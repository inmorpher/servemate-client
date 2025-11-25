import { ReactNode } from 'react';
import { ListSkeleton } from '../components/skeleton/ListSkeleton';
import { cn } from '../utils/classNames';

interface ListProps<T extends { id: number }> {
	items: T[] | undefined;
	ItemComponent: (item: T) => ReactNode;
	isLoading?: boolean;
	isFetching?: boolean;
	emptyMessage?: string;
	skeletonCount?: number;
	className?: string;
}

/**
 * Generic List component that renders a collection of items, a loading skeleton, or an empty message.
 *
 * @template T - The item type. Must contain a numeric `id` property used as the React `key`.
 *
 * @param items - Optional array of items to render. If `undefined` while `isLoading` is true, a skeleton is shown.
 * @param ItemComponent - Function that given an item of type `T` returns a renderable React node (JSX.Element / React.ReactNode).
 * @param isLoading - When true and `items` is not yet available, the component renders a ListSkeleton with `skeletonCount`.
 * @param isFetching - When true, each rendered item wrapper receives a CSS class (`animate-pulse`) to indicate background fetching.
 * @param emptyMessage - Message displayed when `items` is empty or not provided (and not loading). Defaults to `"No items found"`.
 * @param skeletonCount - Number of skeleton rows to render when loading. Defaults to `5`.
 * @param className - Optional additional className applied to the container (merged with a default vertical spacing class).
 *
 * @remarks
 * - The component requires that each item has a unique numeric `id` because it uses `item.id` as the React key.
 * - Rendering behavior:
 *   - If `isLoading` is true and `items` is falsy: returns a <ListSkeleton count={skeletonCount} />.
 *   - If not loading and `items` is empty or falsy: returns a centered, gray empty message.
 *   - Otherwise: maps `items` and renders `ItemComponent(item)` inside a wrapper div; the wrapper will receive `animate-pulse` when `isFetching` is true.
 * - The container has a default `'space-y-4'` spacing and an inline style of `{ minHeight: 'inherit' }`.
 *
 * @returns Rendered list UI: skeleton, empty message, or mapped item components.
 *
 * @example
 * // Example usage:
 * // <List<MyItemType>
 * //   items={items}
 * //   ItemComponent={(item) => <MyItemRow item={item} />}
 * //   isLoading={isLoading}
 * //   isFetching={isFetching}
 * // />
 **/
export const List = <T extends { id: number }>({
	items,
	ItemComponent,
	isLoading,
	isFetching,
	emptyMessage = 'No items found',
	skeletonCount = 5,
	className,
}: ListProps<T>) => {
	if (isLoading && !items) {
		return <ListSkeleton count={skeletonCount} />;
	}

	if (!isLoading && (!items || items.length === 0)) {
		return <div className='text-center text-gray-500'>{emptyMessage}</div>;
	}

	return (
		<div className={cn('space-y-4', className)} style={{ minHeight: 'inherit' }}>
			{items?.map((item) => (
				<div key={item.id} className={cn(isFetching && 'animate-pulse')}>
					{ItemComponent(item)}
				</div>
			))}
		</div>
	);
};
