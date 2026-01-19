import { FilterContainer } from './ui/FilterContainer';
import { FilterGroup } from './ui/FilterGroup';
export { DateInput } from './ui/DateInput';
export { DateRangeInput } from './ui/DateRangeInput';

export const Filter = Object.assign(FilterContainer, {
	Group: FilterGroup,
});
