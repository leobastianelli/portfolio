title: AC Head Tracking
role: Proyecto propio

## Summary
Head tracking por webcam para Assetto Corsa e iRacing: la cámara del juego sigue el movimiento de tu cabeza y tus ojos sin hardware especial ni tocar el mouse o el joystick.

## Technical
MediaPipe detecta los landmarks de la cara por webcam y OpenCV (solvePnP) calcula yaw/pitch/roll y posición de la cabeza contra un modelo de 13 puntos calibrado con la cámara real. Un filtro One Euro suaviza la señal, y los landmarks de iris suman una segunda señal de mirada — girar los ojos sin girar la cabeza — que se combina con la rotación real. El resultado se escribe en la memoria compartida del protocolo FreeTrack, que Assetto Corsa lee de forma nativa; para iRacing, que sólo entiende TrackIR, se puentea con la misma DLL que usa opentrack, sin tocar el pipeline de Python. Herramientas propias graban un clip de referencia y lo reproducen contra el pipeline real para comparar cambios de configuración sin abrir el juego, y hay tests unitarios de la geometría de pose contra datos sintéticos.
