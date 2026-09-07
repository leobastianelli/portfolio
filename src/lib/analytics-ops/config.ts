type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function analyticsConfig() {
  const serviceAccount = JSON.parse(required("GOOGLE_SERVICE_ACCOUNT_JSON")) as ServiceAccount;
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing required fields");
  }

  return {
    databaseUrl: required("ANALYTICS_DATABASE_URL"),
    clarityToken: required("CLARITY_API_TOKEN"),
    gscSiteUrl: required("GSC_SITE_URL"),
    serviceAccount,
    posthogApiKey: required("POSTHOG_PERSONAL_API_KEY"),
    posthogProjectId: required("POSTHOG_PROJECT_ID"),
    posthogHost: (process.env.POSTHOG_HOST?.trim() || "https://eu.posthog.com").replace(/\/$/, ""),
  };
}
