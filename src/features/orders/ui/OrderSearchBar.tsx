import { Search } from '@/features/search';
import { Allergy, OrderSearchCriteria } from '@servemate/dto';
import { useState } from 'react';

interface OrderSearchBarProps {
	isLoading: boolean;
	criteria: OrderSearchCriteria;
	updateCriteria: (newCriteria: OrderSearchCriteria) => void;
}

export const OrderSearchBar = ({ isLoading, criteria, updateCriteria }: OrderSearchBarProps) => {
	const [searchValue, setSearchValue] = useState<string>('');

	const handleChange = (key: string, value: unknown) => {
		if (value === '') {
			value = undefined; // Convert empty string to undefined
		}

		updateCriteria({
			...criteria,
			[key]: value,
		});
	};

	const handleAllergyChange = (key: string, value: unknown) => {
		if (value && typeof value === 'string') {
			const allergyValue = value.trim() as Allergy;
			const currentAllergies = criteria.allergies || [];
			if (!currentAllergies.includes(allergyValue)) {
				updateCriteria({
					...criteria,
					allergies: [...currentAllergies, allergyValue],
				});
			}
		}
	};

	return (
		<Search onSubmit={() => console.log('Search submitted')}>
			<Search.Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
			{/* <Search.Wrapper>
				<div className='flex flex-wrap gap-2 mt-2'>
					<Search.Select
						name='allergies'
						value={undefined} // всегда сброшен после выбора
						onChange={handleAllergyChange}
						options={orderSearchOptions.allergies.filter(
							(allergy) => !criteria.allergies?.includes(allergy.value)
						)}
						defaultOption={true}
					/>
					{criteria.allergies?.map((allergy) => (
						<div key={allergy} className='allergy-chip'>
							<Search.Chip
								onRemove={() =>
									updateCriteria({
										...criteria,
										allergies: criteria.allergies?.filter((a) => a !== allergy),
									})
								}
							>
								{allergy}
							</Search.Chip>
						</div>
					))} */}
			{/* </div>
			</Search.Wrapper> */}
		</Search>
	);
};
