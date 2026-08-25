title: Greens Club
role: Developer

## Summary
Coaching de golf con inteligencia artificial. Un caddie conversacional responde consultas durante la partida, hay análisis de swing por video, distancias por GPS y una tienda para socios. Disponible como web app, iOS y Android.

## Technical
Next.js con Supabase para base de datos, autenticación y almacenamiento. El caddie conversacional corre sobre un modelo de lenguaje de terceros, con streaming propio. El análisis de swing no usa pose estimation ni computer vision tradicional: el video se sube completo a un servicio de visión por IA que lo procesa de forma nativa, con un cron job en Vercel resolviendo la cola de análisis pendientes. Pagos con Stripe, monitoreo de errores con Sentry y analytics con PostHog.
