import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import points from './Points.json';
import * as TWEEN from '@tweenjs/tween.js'; // Import TWEEN library

const ThreatMap = () => {
    const canvasRef = useRef(null);
    let scene, camera, renderer, earthMesh, pointMeshes = [];

    const plotPoints = () => {
        const pointGeometry = new THREE.SphereGeometry(0.0069, 16, 16);
        const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red for source
        const destinationMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green for destination
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue for arrow
    
        points.forEach(({ source_latitude, source_longitude, destination_latitude, destination_longitude }) => {
            const sourcePoint = new THREE.Mesh(pointGeometry, sourceMaterial);
            const { x: sourceX, y: sourceY, z: sourceZ } = calculatePointCoordinates(source_longitude, source_latitude);
            sourcePoint.position.set(sourceX, sourceY, sourceZ);
            scene.add(sourcePoint);
    
            const destinationPoint = new THREE.Mesh(pointGeometry, destinationMaterial);
            const { x: destinationX, y: destinationY, z: destinationZ } = calculatePointCoordinates(destination_longitude, destination_latitude);
            destinationPoint.position.set(destinationX, destinationY, destinationZ);
            scene.add(destinationPoint);
    
            // Create arrow
            const arrowDirection = new THREE.Vector3(destinationX - sourceX, destinationY - sourceY, destinationZ - sourceZ).normalize();
            const arrowLength = Math.sqrt(Math.pow(destinationX - sourceX, 2) + Math.pow(destinationY - sourceY, 2) + Math.pow(destinationZ - sourceZ, 2));
    
            const arrowGeometry = new THREE.CylinderGeometry(0.005, 0.01, arrowLength - 0.02, 12); // Adjust the radii and length as needed
            const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
            arrowMesh.position.set((destinationX + sourceX) / 2, (destinationY + sourceY) / 2, (destinationZ + sourceZ) / 2);
            arrowMesh.lookAt(new THREE.Vector3(destinationX, destinationY, destinationZ));
            scene.add(arrowMesh);
        });
    };
    
    
    

    const calculatePointCoordinates = (lon, lat) => {
        const lonRad = lon * (Math.PI / 180);
        const latRad = lat * (Math.PI / 180);
        const radius = 1;
        const x = radius * Math.cos(latRad) * Math.cos(lonRad);
        const y = radius * Math.sin(latRad);
        const z = radius * Math.cos(latRad) * Math.sin(lonRad);
        return { x, y, z };
    };

    useEffect(() => {
        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
            renderer.setSize(window.innerWidth, window.innerHeight);

            const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
            const loader = new THREE.TextureLoader();
            const earthTexture = loader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
            const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
            earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
            scene.add(earthMesh);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.rotateSpeed = 0.35;

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                TWEEN.update(); // Update TWEEN animations
                renderer.render(scene, camera);
            };

            animate();
        };

        init();

        plotPoints();

        return () => {
            pointMeshes.forEach(mesh => scene.remove(mesh));
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default ThreatMap;
