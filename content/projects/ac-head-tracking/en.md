title: AC Head Tracking
role: Personal project

## Summary
Webcam head tracking for Assetto Corsa and iRacing: the in-game camera follows your head and eye movement with no special hardware and no mouse or joystick.

## Technical
MediaPipe detects face landmarks from the webcam, and OpenCV's solvePnP computes head yaw/pitch/roll and position against a 13-point model calibrated to the real camera. A One Euro filter smooths the signal, and iris landmarks add a second gaze signal — eyes moving without the head turning — that combines with the real head rotation. The result is written to the shared memory used by the FreeTrack protocol, which Assetto Corsa reads natively; for iRacing, which only understands TrackIR, it's bridged through the same DLL opentrack uses, with no changes to the Python pipeline itself. Custom tooling records a reference clip and replays it through the real pipeline to compare configuration changes without opening the game, plus unit tests cover the pose geometry against synthetic data.
