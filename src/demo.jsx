import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import points from './Points.json';
import './App.css';

const ThreatMap = () => {
    const canvasRef = useRef(null);
    const [topCountries, setTopCountries] = useState([]);

    let scene, camera, renderer, earthMesh, pointMeshes = [], arrowMeshes = [];

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
    }, []);

    const Dropdown = ({ country }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

        return (
            <div className="dropdown">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                    {country}
                    <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
                </button>
                {isOpen && (
                    <ul className="dropdown-menu">
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                )}
            </div>
        );
    };

    const plotPoints = () => {
        const pointGeometry = new THREE.SphereGeometry(0.0276, 16, 16);
        const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green for source
        const destinationMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red for destination
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

            // Create animated arrow curve
            const curvePoints = [];
            const steps = 100;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const point = new THREE.Vector3().lerpVectors(
                    new THREE.Vector3(sourceX, sourceY, sourceZ),
                    new THREE.Vector3(destinationX, destinationY, destinationZ),
                    t
                ).normalize().multiplyScalar(2.011); // Slightly above the surface to avoid clipping
                curvePoints.push(point);
            }

            const curve = new THREE.CatmullRomCurve3(curvePoints);
            const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.011, 8, false); // Larger tube geometry
            const arrowMesh = new THREE.Mesh(tubeGeometry, arrowMaterial);
            arrowMesh.curve = curve; // Save curve for animation
            arrowMesh.t = 0; // Initial animation parameter
            arrowMeshes.push(arrowMesh);
            scene.add(arrowMesh);

            pointMeshes.push(sourcePoint, destinationPoint);
        });
    };

    const calculatePointCoordinates = (lon, lat) => {
        const lonRad = lon * (Math.PI / 180);
        const latRad = lat * (Math.PI / 180);
        const radius = 4;
        const x = radius * Math.cos(latRad) * Math.cos(lonRad);
        const y = radius * Math.sin(latRad);
        const z = radius * Math.cos(latRad) * Math.sin(lonRad);
        return { x, y, z };
    };

    useEffect(() => {
        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 6.5;

            renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
            renderer.setClearColor(0x87ceeb); // Sky blue color
            renderer.setSize(window.innerWidth, window.innerHeight);

            const earthGeometry = new THREE.SphereGeometry(4, 32, 32);
            const loader = new THREE.TextureLoader();
            const earthTexture = loader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
            const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
            earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
            scene.add(earthMesh);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.rotateSpeed = 0.35;
            controls.enableZoom = false;

            const animate = () => {
                requestAnimationFrame(animate);

                // Animate arrows
                arrowMeshes.forEach(arrowMesh => {
                    arrowMesh.t += 0.01;
                    if (arrowMesh.t > 1) arrowMesh.t = 0;
                    const point = arrowMesh.curve.getPoint(arrowMesh.t);
                    arrowMesh.position.copy(point);
                });

                controls.update();
                renderer.render(scene, camera);
            };

            animate();
        };

        init();
        plotPoints();

        return () => {
            pointMeshes.forEach(mesh => scene.remove(mesh));
            arrowMeshes.forEach(mesh => scene.remove(mesh));
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '96.5vh', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 10, left: 10,  padding: '20px', overflowY: 'auto', boxSizing: 'border-box' }}>
                <div className="widget-container">
                    <h2>TOP TARGETED COUNTRIES</h2>
                    {topCountries.map((item, index) => (
                        <Dropdown key={index} country={item.country} />
                    ))}
                </div>
            </div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default ThreatMap;
