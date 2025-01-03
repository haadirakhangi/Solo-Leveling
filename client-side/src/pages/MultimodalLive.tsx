import { useRef, useState, useEffect } from "react";
import "./App.scss";
import { LiveAPIProvider } from "../contexts/LiveAPIContext";
import { Altair } from "../components/altair/Altair";
import ControlTray from "../components/control-tray/ControlTray";
import cn from "classnames";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useToast, Box, Image, Flex } from '@chakra-ui/react';
import jsonData from '../data/scenarios.json'
import img1 from '../assets/scenario/scenario1.png'
import img2 from '../assets/scenario/scenario2.jpg'
import img3 from '../assets/scenario/scenario3.jpg'
import img4 from '../assets/scenario/scenario4.jpg'
import img5 from '../assets/scenario/scenario5.jpg'
import img6 from '../assets/scenario/scenario6.jpg'
import { TfiTimer } from "react-icons/tfi";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

const imagePaths = [
    img1, img2, img3, img4, img5, img6,
];
const MultimodalLive = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedScenario, setSelectedScenario] = useState(jsonData[0]);
    const [selectedImage, setSelectedImage] = useState(imagePaths[0]);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    const getRandomScenario = () => {
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        const randomImageIndex = Math.floor(Math.random() * imagePaths.length);
        setSelectedScenario(jsonData[randomIndex]);
        setSelectedImage(imagePaths[randomImageIndex]);
    };

    useEffect(() => {
        getRandomScenario(); // Select a random scenario on load
    }, []);

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
        formData.append("video_file", videoBlob, "recording.webm");

        try {
            const response = await axios.post("/api/student/analyze-conversation", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Check if the response status is 200 (successful)
            if (response.status === 200) {
                navigate('/');
                toast({
                    title: "Successfully analyzed",
                    description: "Your video was analyzed successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            toast({
                title: "Error uploading video",
                description: "There was an issue uploading the video. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const downloadVideo = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "recording.webm";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="App">
            <LiveAPIProvider url={uri} apiKey={API_KEY}>
                <div className="streaming-console">
                    <main>
                        <div className="main-app-area">
                            <Altair />
                            {/* Display video stream */}
                            <Flex>
                                <Box as="section" color="fg.muted" backgroundColor="#18181b" height="98vh" borderRadius="2xl" border="1px" style={{ "fontFamily": "Jost" }} width="33.33vw">
                                    <Box as="section" color="fg.muted" backgroundColor="#18181b" padding="30px" borderRadius="2xl" textAlign="center" fontSize="2xl">
                                        <h2>{selectedScenario.title}</h2>
                                    </Box>
                                    <Box as="section" padding="12px" textAlign="center">
                                        <Image
                                            src={selectedImage}
                                            alt="Scenario Visual"
                                            boxSize="300px"
                                            objectFit="cover"
                                            borderRadius="lg"
                                            mx="auto"
                                        />
                                    </Box>
                                    <Box as="section" color="fg.muted" backgroundColor="#27272a" padding="12px" borderRadius="2xl" border="1px" margin="10px">
                                        <p><strong>Scenario:</strong> {selectedScenario.scenario}</p>
                                    </Box>
                                    <Box as="section" color="fg.muted" backgroundColor="#27272a" padding="12px" borderRadius="2xl" border="1px" margin="10px">
                                        <p><strong>AI Role:</strong> {selectedScenario.ai_role}</p>
                                    </Box>
                                    <Box as="section" color="fg.muted" backgroundColor="#27272a" padding="12px" borderRadius="2xl" border="1px" margin="10px">
                                        <p><strong>Student Role:</strong> {selectedScenario.student_role}</p>
                                    </Box>
                                </Box>
                                <Box as="section" color="fg.muted" backgroundColor="#27272a" borderRadius="2xl" height="98vh" border="1px" width="33.33vw" marginLeft="7px" marginRight="7px">
                                    <video
                                        ref={videoRef}
                                        className={cn("stream", { hidden: !videoStream })}
                                        autoPlay
                                        playsInline
                                    />
                                </Box>
                                <Box as="section" color="fg.muted" backgroundColor="#27272a" height="98vh" borderRadius="2xl" border="1px" width="33.33vw">
                                    <Box  as="section" color="fg.muted" backgroundColor="#27272a" padding="10px" borderRadius="2xl" border="1px" margin="10px">
                                    <TfiTimer size="4rem"/>
                                    </Box>
                                </Box>
                            </Flex>

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
