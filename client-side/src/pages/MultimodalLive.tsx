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
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

    const startRecording = async () => {
        try {
            // Capture screen video and audio (including system audio)
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true, // System audio is captured if supported
            });
            setScreenStream(screenStream); // Save screen stream for later stopping

            // Capture microphone audio and video
            const userMediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setVideoStream(userMediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = userMediaStream;
                videoRef.current.muted = true; // Prevent feedback
            }

            // Combine the screen and user microphone streams
            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            // Create audio sources for both screen and microphone
            const screenAudioSource = audioContext.createMediaStreamSource(screenStream);
            const micAudioSource = audioContext.createMediaStreamSource(userMediaStream);

            // Connect the audio sources to the audio context's destination
            screenAudioSource.connect(destination);
            micAudioSource.connect(destination);

            // Now, the mixed audio is available in the destination.stream
            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(), // Screen video
                ...userMediaStream.getVideoTracks(), // User video
                ...destination.stream.getAudioTracks(), // Mixed audio (screen + microphone)
            ]);

            // Initialize the media recorder
            const recorder = new MediaRecorder(combinedStream);
            setMediaRecorder(recorder);

            const chunks: Blob[] = [];
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                setRecordedBlob(blob);
                await sendVideoToBackend(blob);
                downloadVideo(blob);
            };

            recorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }

        if (screenStream) {
            screenStream.getTracks().forEach((track) => track.stop());
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