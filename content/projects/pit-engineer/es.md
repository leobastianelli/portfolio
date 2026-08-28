title: Pit Engineer
role: Proyecto propio

## Summary
Asistente de ingeniería de pista con IA para iRacing. Lee la telemetría en tiempo real, analiza cada vuelta contra tu mejor referencia y te da feedback por voz y texto, como un ingeniero real por radio.

## Technical
Un demonio en Python sondea la memoria compartida de iRacing a 60Hz y separa cada vuelta en 3 sectores para calcular deltas contra la vuelta de referencia. Un validador descarta vueltas con trompos o salidas de pista antes de tomarlas como nuevo mejor histórico. El resumen estructurado de cada vuelta se manda a Claude Haiku, que redacta el comentario del ingeniero; sin API key o si falla la llamada, cae a un modo determinístico sin IA. La interfaz es un overlay con PyQt6 sobre el juego, con lectura en voz por edge-tts. El pipeline de análisis es Python puro sin dependencia de iRacing, PyQt6 ni la API de Anthropic, así que tiene una suite de tests unitarios que corre sin el simulador abierto.
