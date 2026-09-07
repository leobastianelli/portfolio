export type PageContext = {
  pageKey: string;
  locale: "en" | "es" | "unknown";
  contentType: "home" | "notes_index" | "note" | "unknown";
  contentSlug: string | null;
};

export type PageDayRow = PageContext & {
  date: string;
};

export type GscPageRow = PageDayRow & {
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
};

export type GscQueryRow = {
  date: string;
  pageKey: string;
  query: string;
  device: string;
  country: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
};

export type PostHogRow = PageDayRow & {
  pageviews: number;
  visitors: number;
  contactClicks: number;
  projectLinkClicks: number;
  noteReads: number;
};

export type ClarityRow = PageDayRow & {
  sessions: number;
  engagementSeconds: number | null;
  scrollDepth: number | null;
  deadClicks: number;
  rageClicks: number;
  quickbacks: number;
  scriptErrors: number;
};
