title: RET Enrollment System
role: Desarrollador

## Summary
Sistema de inscripciones para una facultad, usado por estudiantes, docentes y administración, con una vista distinta para cada rol.

## Technical
Next.js sobre Firebase (Auth y Firestore, con Firebase Admin en el servidor). El rol no se resuelve con custom claims: se consulta la existencia del documento correspondiente en Firestore, con sesión por cookie verificada server-side y protección en dos capas — helpers de servidor y reglas de Firestore que replican la misma lógica de roles. El enrutamiento por rol se apoya en route groups de Next.js, cada uno con su propio layout. Dashboards con shadcn/ui y Recharts.
