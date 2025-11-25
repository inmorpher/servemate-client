// Helper function to generate a tab title based on the path
export const getTabTitle = (path: string): string => {
	const cleaned = path.replace(/^\//, '');
	const parts = cleaned.split('/');

	if (parts.length === 2) {
		const entity = parts[0].slice(0, -1);
		return `${entity.charAt(0).toUpperCase() + entity.slice(1)} #${parts[1]}`;
	}

	return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
};
