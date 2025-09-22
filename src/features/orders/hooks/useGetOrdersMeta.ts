"use client";

import { useSearchCriteria } from "@/shared/hooks/useSearchCriteria";
import { OrderMetaDTO, OrderSearchSchema } from "@servemate/dto";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { orderApiClient } from "../api/client";

/**
 * Custom hook to fetch metadata for orders using react-query.
 *
 * @returns {UseQueryResult<OrderMetaDTO>} The result of the query containing order metadata.
 */
export const useGetOrdersMeta = (): UseQueryResult<OrderMetaDTO> => {
  const orderSearchCriteria = useSearchCriteria({
    schema: OrderSearchSchema,
    numberFields: [
      "id",
      "page",
      "pageSize",
      "guestsCount",
      "minAmount",
      "maxAmount",
    ],
    arrayFields: ["status"],
  });

  const ordersMeta = useQuery({
    queryKey: ["ordersMeta", orderSearchCriteria],
    queryFn: () => orderApiClient.getMeta(orderSearchCriteria),
    placeholderData: keepPreviousData,
    notifyOnChangeProps: ["data", "error", "isLoading", "isFetching"],
    staleTime: 5 * 60 * 1000, // 5 minutes

    refetchOnWindowFocus: false,
  });

  // 

  return ordersMeta;
};
