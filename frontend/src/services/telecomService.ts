import { apiClient } from "../api/client";
import type { ApiSuccessResponse } from "../api/client";
import type { AnalyticsSummaryResponse, CdrListResponse, TelecomFilters } from "../types/telecom";

function toStartOfDayIso(dateValue: string): string {
  return `${dateValue}T00:00:00Z`;
}

function toEndOfDayIso(dateValue: string): string {
  return `${dateValue}T23:59:59Z`;
}

function buildFilterParams(filters: TelecomFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  if (filters.startDate) {
    params.start_date = toStartOfDayIso(filters.startDate);
  }
  if (filters.endDate) {
    params.end_date = toEndOfDayIso(filters.endDate);
  }
  if (filters.caller.trim()) {
    params.caller = filters.caller.trim();
  }
  if (filters.receiver.trim()) {
    params.receiver = filters.receiver.trim();
  }
  if (filters.city.trim()) {
    params.city = filters.city.trim();
  }
  if (filters.location.trim()) {
    params.location = filters.location.trim();
  }
  if (filters.callType) {
    params.call_type = filters.callType;
  }

  return params;
}

export async function fetchAnalyticsSummary(filters: TelecomFilters): Promise<AnalyticsSummaryResponse> {
  const response = await apiClient.get<ApiSuccessResponse<AnalyticsSummaryResponse>>("/analytics/summary", {
    params: {
      ...buildFilterParams(filters),
      top_n: filters.topN,
    },
  });
  return response.data.data;
}

export async function fetchCdrList(
  filters: TelecomFilters,
  page: number,
  pageSize: number,
): Promise<CdrListResponse> {
  const response = await apiClient.get<ApiSuccessResponse<CdrListResponse>>("/cdr/", {
    params: {
      ...buildFilterParams(filters),
      page,
      page_size: pageSize,
    },
  });
  return response.data.data;
}
