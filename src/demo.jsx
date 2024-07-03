import React, { useEffect, useRef, useState } from 'react'; // Importing necessary React hooks and modules
import * as THREE from 'three'; // Importing the Three.js library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Importing OrbitControls for camera control
import points from './Points.json'; // Importing points data from a JSON file

const ThreatMap = () => {
    const canvasRef = useRef(null); // Creating a ref to the canvas element
    const [topCountries, setTopCountries] = useState([]); // State to store top ten countries data

    let scene, camera, renderer, earthMesh, pointMeshes = []; // Declare variables for Three.js components

    useEffect(() => {
        // Dummy data for top ten countries (replace with actual data)
        setTopCountries([
            { country: 'Country 1', value: 100 },
            { country: 'Country 2', value: 90 },
            { country: 'Country 3', value: 80 },
            { country: 'Country 4', value: 70 },
            { country: 'Country 5', value: 60 },
            { country: 'Country 6', value: 50 },
            { country: 'Country 7', value: 40 },
            { country: 'Country 8', value: 30 },
            { country: 'Country 9', value: 20 },
            { country: 'Country 10', value: 10 },
        ]);
    }, []); // Setting initial state with dummy data on component mount

    const plotPoints = () => {
        // Function to plot points on the globe
        const pointGeometry = new THREE.SphereGeometry(0.0276, 16, 16); // Sphere geometry for points
        const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green material for source points
        const destinationMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red material for destination points
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue material for arrows

        points.forEach(({ source_latitude, source_longitude, destination_latitude, destination_longitude }) => {
            // Iterate over each point and plot source and destination
            const sourcePoint = new THREE.Mesh(pointGeometry, sourceMaterial); // Create source point mesh
            const { x: sourceX, y: sourceY, z: sourceZ } = calculatePointCoordinates(source_longitude, source_latitude); // Calculate coordinates
            sourcePoint.position.set(sourceX, sourceY, sourceZ); // Set position of source point
            scene.add(sourcePoint); // Add source point to the scene

            const destinationPoint = new THREE.Mesh(pointGeometry, destinationMaterial); // Create destination point mesh
            const { x: destinationX, y: destinationY, z: destinationZ } = calculatePointCoordinates(destination_longitude, destination_latitude); // Calculate coordinates
            destinationPoint.position.set(destinationX, destinationY, destinationZ); // Set position of destination point
            scene.add(destinationPoint); // Add destination point to the scene

            // Create arrow curve
            const curvePoints = [];
            const steps = 100; // Number of points along the curve
            for (let i = 0; i <= steps; i++) {
                const t = i / steps; // Calculate interpolation factor
                const point = new THREE.Vector3().lerpVectors(
                    new THREE.Vector3(sourceX, sourceY, sourceZ),
                    new THREE.Vector3(destinationX, destinationY, destinationZ),
                    t
                ).normalize().multiplyScalar(4.001); // Slightly above the surface to avoid clipping
                curvePoints.push(point); // Add point to curve
            }

            const curve = new THREE.CatmullRomCurve3(curvePoints); // Create a curve from the points
            const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.011, 8, false); // Create tube geometry for the curve
            const arrowMesh = new THREE.Mesh(tubeGeometry, arrowMaterial); // Create arrow mesh
            scene.add(arrowMesh); // Add arrow mesh to the scene

            pointMeshes.push(sourcePoint, destinationPoint, arrowMesh); // Store meshes in an array for later removal
        });
    };

    const calculatePointCoordinates = (lon, lat) => {
        // Function to calculate 3D coordinates from latitude and longitude
        const lonRad = lon * (Math.PI / 180); // Convert longitude to radians
        const latRad = lat * (Math.PI / 180); // Convert latitude to radians
        const radius = 4; // Radius of the globe
        const x = radius * Math.cos(latRad) * Math.cos(lonRad); // Calculate X coordinate
        const y = radius * Math.sin(latRad); // Calculate Y coordinate
        const z = radius * Math.cos(latRad) * Math.sin(lonRad); // Calculate Z coordinate
        return { x, y, z }; // Return coordinates
    };

    useEffect(() => {
        // Initialize Three.js scene
        const init = () => {
            scene = new THREE.Scene(); // Create a new scene
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Create a perspective camera
            camera.position.z = 6.5; // Set initial camera position

            renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current }); // Create a WebGL renderer
            renderer.setClearColor(0x87ceeb); // Set background color
            renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size

            const earthGeometry = new THREE.SphereGeometry(4, 32, 32); // Create geometry for the earth
            const loader = new THREE.TextureLoader(); // Create a texture loader
            const earthTexture = loader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'); // Load earth texture
            const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture }); // Create material for the earth
            earthMesh = new THREE.Mesh(earthGeometry, earthMaterial); // Create earth mesh
            scene.add(earthMesh); // Add earth mesh to the scene

            const controls = new OrbitControls(camera, renderer.domElement); // Create orbit controls for the camera
            controls.enableDamping = true; // Enable damping for smooth movement
            controls.dampingFactor = 0.25; // Set damping factor
            controls.rotateSpeed = 0.35; // Set rotation speed
            controls.enableZoom = false; // Disable zoom

            const animate = () => {
                requestAnimationFrame(animate); // Request animation frame
                controls.update(); // Update controls
                renderer.render(scene, camera); // Render the scene
            };

            animate(); // Start animation loop
        };

        init(); // Call init function
        plotPoints(); // Plot points on the globe

        return () => {
            // Cleanup function
            pointMeshes.forEach(mesh => scene.remove(mesh)); // Remove all point meshes from the scene
        };
    }, []); // Run effect only once on component mount

    return (
        <div style={{ position: 'relative', width: '100%', height: '96.5vh', overflow: 'hidden' }}>
            {/* Container div for the canvas and side panel */}
            <div style={{ position: 'absolute', top: 10, left: 10, width: '20%', height: '80%', backgroundColor: 'rgba(240, 240, 240, 0.8)', padding: '20px', overflowY: 'auto', boxSizing: 'border-box' }}>
                <h2>Top 10 Countries</h2>
                {/* Side panel displaying top ten countries */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {topCountries.map((country, index) => (
                        <li key={index}>{country.country}: {country.value}</li>
                    ))}
                </ul>
            </div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {/* Canvas element for rendering the Three.js scene */}
        </div>
    );
};

export default ThreatMap; // Export the ThreatMap component as default
