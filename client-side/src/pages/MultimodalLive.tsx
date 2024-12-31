import { useRef, useState, useEffect } from "react";
import "./App.scss";
import { LiveAPIProvider } from "../contexts/LiveAPIContext";
import { Altair } from "../components/altair/Altair";
import ControlTray from "../components/control-tray/ControlTray";
import cn from "classnames";
import axios from "axios"; // For sending video to backend

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

const MultimodalLive = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

    const startRecording = async () => {
        try {
            // Capture video and microphone audio (user media)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setVideoStream(stream);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // Mute video audio playback to prevent feedback to speakers
                videoRef.current.muted = true;
            }

            // Capture system audio from the browser (e.g., audio from the video element)
            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            // Create a media element source (for audio coming from the browser's video or audio elements)
            const mediaElementSource = audioContext.createMediaElementSource(videoRef.current!); // assuming you are using a video element
            mediaElementSource.connect(destination);

            // Combine microphone and system audio tracks
            const combinedStream = new MediaStream([
                ...stream.getTracks(), // Add video and microphone audio tracks
                ...destination.stream.getTracks(), // Add the system audio tracks
            ]);

            const recorder = new MediaRecorder(combinedStream);
            setMediaRecorder(recorder);

            const chunks: Blob[] = [];
            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                setRecordedBlob(blob);
                await sendVideoToBackend(blob);
                downloadVideo(blob);
            };

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing media devices:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }
        if (videoStream) {
            videoStream.getTracks().forEach((track) => track.stop());
        }
        setIsRecording(false);
    };

    const sendVideoToBackend = async (videoBlob: Blob) => {
        const formData = new FormData();
        formData.append("video", videoBlob, "recording.webm");

        try {
            await axios.post("/api/student/video-upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Video successfully uploaded.");
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    const downloadVideo = (blob: Blob) => {
        const url = URL.createObjectURL(blob); // Create an object URL for the Blob
        const link = document.createElement("a"); // Create a temporary anchor element
        link.href = url; // Set the download URL
        link.download = "recording.webm"; // Set the default file name
        link.click(); // Trigger the download
        URL.revokeObjectURL(url); // Clean up the object URL after download
    };

    return (
        <div className="App">
            <LiveAPIProvider url={uri} apiKey={API_KEY}>
                <div className="streaming-console">
                    <main>
                        <div className="main-app-area">
                            <Altair />
                            {/* Display video stream */}
                            <video
                                ref={videoRef}
                                className={cn("stream", { hidden: !videoStream })}
                                autoPlay
                                playsInline
                            />
                        </div>

                        {/* Control tray */}
                        <ControlTray
                            isRecording={isRecording}
                            startRecording={startRecording}
                            stopRecording={stopRecording}
                        />
                    </main>
                </div>
            </LiveAPIProvider>
        </div>
    );
};

export default MultimodalLive;
