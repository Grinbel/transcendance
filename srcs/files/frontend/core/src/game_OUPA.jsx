import React from 'react';
import  { useEffect, useState } from 'react'; 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Text } from 'troika-three-text';
import { userContext } from "./contexts/userContext.jsx";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

const Game = () => {
	const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
	const roomName = searchParams.get("value");
	console.log('ROOMNAME ' + roomName);
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState({});
//    const threeJsRef = useRef();

    useEffect(() => {
		console.log('trying to create socket')
        const newSocket = new WebSocket(`ws://localhost:8000/ws/pong/${roomName}/`);
		console.log('socket created')
        setSocket(newSocket);
		console.log('socket set')

        newSocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newSocket.onmessage = (event) => {
            setGameState(JSON.parse(event.data));
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => newSocket.close();
    }, [roomName]);

    useEffect(() => {
//        if (!threeJsRef.current) {
  //          threeJsRef.current = initThreeJs();
   //     }
        const animate = () => {
            //requestAnimationFrame(animate);
            // Mettre à jour la scène avec gameState
            //updateThreeJs(threeJsRef.current, gameState);
        };
        animate();
    }, [gameState]);

    const initThreeJs = () => {
        // Initialisation de la scène Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        return { scene, camera, renderer };
    };

    const updateThreeJs = (threeJsInstance, gameState) => {
        const { scene, camera, renderer } = threeJsInstance;
        // Mettre à jour les objets Three.js en fonction de gameState
        renderer.render(scene, camera);
    };

    return <div />;
};

export default Game;
