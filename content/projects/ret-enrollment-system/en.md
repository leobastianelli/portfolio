title: RET Enrollment System
role: TODO — role not confirmed yet.

## Summary
An enrollment system for a university department, used by students, faculty, and administration, each with its own view.

## Technical
Next.js on Firebase (Auth and Firestore, with Firebase Admin on the server). Roles aren't resolved via custom claims: access checks whether a matching document exists in Firestore, with a server-verified session cookie and two-layer protection — server-side helpers plus Firestore rules that mirror the same role logic. Role-based routing leans on Next.js route groups, each with its own layout. Dashboards built with shadcn/ui and Recharts.
