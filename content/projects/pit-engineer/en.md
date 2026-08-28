title: Pit Engineer
role: Personal project

## Summary
AI-powered race engineer for iRacing. Reads live telemetry, analyzes every lap against your best reference, and gives you voice and text feedback — like a real engineer on the radio.

## Technical
A Python daemon polls iRacing's shared memory at 60Hz and splits each lap into 3 sectors to compute deltas against the reference lap. A validator rejects spins or off-track excursions before they count as a new historical best. The structured lap summary goes to Claude Haiku, which writes the engineer's commentary; with no API key or a failed call, it falls back to a deterministic, AI-free coach. The interface is a PyQt6 overlay on top of the game, with voice read out via edge-tts. The analysis pipeline is pure Python with no dependency on iRacing, PyQt6, or the Anthropic API, so it has a unit test suite that runs without the sim open.
