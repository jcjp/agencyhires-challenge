export interface Channel {
  id: string;
  title: string;
  customUrl?: string;
  thumbnail: string;
  subscriberCount?: number;
}

export interface Video {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  views: number;
  likes: number;
  comments: number;
  duration?: string;
  viewsPerDay: number;
  isTrending: boolean;
  inWindow: boolean;
}

export interface ChannelMetricsResponse {
  channel: Channel;
  videos: Video[];
  window: "month" | "7d" | "30d";
  analyzedAt: string;
  medianViewsPerDay: number;
}

export interface ResolveChannelResponse {
  channelId: string;
  title: string;
  thumbnail: string;
}

export type SortField = "views" | "viewsPerDay" | "likes" | "publishedAt";
export type SortDirection = "asc" | "desc";
export type WindowOption = "month" | "7d" | "30d";

export interface FilterState {
  sortField: SortField;
  sortDirection: SortDirection;
  window: WindowOption;
  minViews: number;
  search: string;
  inWindowOnly: boolean;
}

export type AppState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ChannelMetricsResponse }
  | { status: "error"; message: string; code?: string };
