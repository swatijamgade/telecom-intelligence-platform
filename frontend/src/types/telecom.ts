export type CallType = "incoming" | "outgoing";

export interface TelecomFilters {
  startDate: string;
  endDate: string;
  caller: string;
  receiver: string;
  city: string;
  location: string;
  callType: "" | CallType;
  topN: number;
}

export interface CallTypeCount {
  call_type: CallType;
  count: number;
}

export interface TopCaller {
  caller_number: string;
  total_calls: number;
  total_duration: number;
}

export interface AnalyticsSummaryResponse {
  total_calls: number;
  total_duration: number;
  call_type_distribution: CallTypeCount[];
  top_callers: TopCaller[];
}

export interface CdrRecord {
  id: string;
  caller_number: string;
  receiver_number: string;
  call_type: CallType;
  duration: number;
  timestamp: string;
  city: string;
  location: string | null;
  created_at: string;
}

export interface CdrListResponse {
  items: CdrRecord[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}
