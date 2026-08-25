title: Greens Club
role: Developer

## Summary
AI-powered golf coaching. A conversational caddie answers questions mid-round, plus video swing analysis, GPS yardages, and a members' store — available as a web app, iOS, and Android.

## Technical
Next.js with Supabase for the database, auth, and storage. The conversational caddie runs on Grok (xAI), called directly over its API with custom streaming. Swing analysis skips pose estimation or traditional computer vision entirely: the full video gets uploaded to Gemini 2.5 Pro, which processes it natively through its multimodal capabilities, with a Vercel cron job working through the queue of pending analyses. Payments run on Stripe, with Sentry for error tracking and PostHog for analytics.
