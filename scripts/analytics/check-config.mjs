const requiredVariables = [
  "ANALYTICS_DATABASE_URL",
  "CLARITY_API_TOKEN",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
  "GSC_SITE_URL",
  "POSTHOG_PERSONAL_API_KEY",
  "POSTHOG_PROJECT_ID",
  "CRON_SECRET",
];

const missing = requiredVariables.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error("Analytics pipeline is not ready. Missing environment variables:");
  for (const name of missing) console.error(`- ${name}`);
  process.exitCode = 1;
} else {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error("expected client_email and private_key");
    }
    new URL(process.env.ANALYTICS_DATABASE_URL);
  } catch (error) {
    console.error(`Analytics configuration is invalid: ${error.message}`);
    process.exitCode = 1;
  }

  if (!process.exitCode) {
    console.log("Analytics pipeline configuration is complete.");
  }
}
