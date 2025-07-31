import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ZodSchema, z } from 'zod';

interface UseSearchCriteriaConfig<TSchema extends ZodSchema> {
	schema: TSchema;
	numberFields?: string[];
	booleanFields?: string[];
	arrayFields?: string[];
}

export const useSearchCriteria = <TSchema extends ZodSchema>({
	schema,
	numberFields = [],
	booleanFields = [],
	arrayFields = [],
}: UseSearchCriteriaConfig<TSchema>): z.infer<TSchema> => {
	const searchParams = useSearchParams();

	const searchCriteria = useMemo(() => {
		const params = Object.fromEntries(searchParams.entries());
		const queryToParse: Record<string, unknown> = {};

		for (const key in params) {
			const value = params[key];

			// Пропускаем пустые или null/undefined значения, чтобы Zod мог применить .optional() или .default()
			if (value === null || value === undefined || value === '') {
				continue;
			}

			if (numberFields.includes(key)) {
				queryToParse[key] = Number(value);
			} else if (booleanFields.includes(key)) {
				queryToParse[key] = value === 'true';
			} else if (arrayFields.includes(key)) {
				queryToParse[key] = String(value)
					.split(',')
					.map((item) => item.trim());
			} else {
				queryToParse[key] = value;
			}
		}

		const parsedResult = schema.safeParse(queryToParse);
		return parsedResult.success ? parsedResult.data : schema.parse({});
	}, [searchParams, schema, numberFields, booleanFields, arrayFields]) as z.infer<TSchema>;

	return searchCriteria;
};
