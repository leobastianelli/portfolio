title: Greens Club
role: Developer

## Summary
Coaching de golf con inteligencia artificial. Un caddie conversacional responde consultas durante la partida, hay análisis de swing por video, distancias por GPS y una tienda para socios. Disponible como web app, iOS y Android.

## Technical
Next.js con Supabase para base de datos, autenticación y almacenamiento. El caddie conversacional corre sobre Grok (xAI), con llamadas directas a su API y streaming propio. El análisis de swing no usa pose estimation ni computer vision tradicional: el video se sube completo a Gemini 2.5 Pro, que lo procesa de forma nativa gracias a su capacidad multimodal, y un cron job en Vercel resuelve la cola de análisis pendientes. Pagos con Stripe, monitoreo de errores con Sentry y analytics con PostHog.
