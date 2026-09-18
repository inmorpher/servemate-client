export const parseDateInput = (value: string): Date => {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
};

export const toDateInputValue = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
export const clampDate = (date: Date, min?: Date, max?: Date): Date => {
	if (min && date < min) return min;
	if (max && date > max) return max;
	return date;
};

export const isSameDay = (a: Date, b: Date): boolean => {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
};

export const getStartOfToday = (): Date => {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const formatDisplayDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${day}.${month}.${year}`;
};
