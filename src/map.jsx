import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import points from './Points.json';
import axios from 'axios'
import './App.css';
import BottomWidget from './BottomWidget';
import countries from './topCountries.json';

const ThreatMap = () => {
    const canvasRef = useRef(null);
    let scene, camera, renderer, earthMesh, pointMeshes = [], arrowMeshes = [];
    const [topCountries, setTopCountries] = useState([]);
    // const [points, setPoints] = useState([]);

    useEffect(() => {
      setTopCountries(countries); // Load data from JSON file
    }, []);

    const handleClick = () => {
      window.open('https://www.rnstechnology.com/', '_blank');
    };

    // useEffect(() => {
    //     // Fetch data from the API
    //     axios.get('http://127.0.0.1:5000/api/ip-info')
    //         .then(response => {
    //             setPoints(response.data);
    //              console.log('Fetched data:', response.data);
    //         })
    //         .catch(error => {
    //             console.error('There was an error fetching the data!', error);
    //         });
    // }, []);


    const plotPoints = () => {
        const pointGeometry = new THREE.SphereGeometry(0.0276, 16, 16);
        const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green for source
        const destinationMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red for destination
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue for arrow

        const createTextSprite = (text) => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          context.font = 'Bold 24px Arial';
          context.fillStyle = 'rgba(255, 255, 255, 1.0)';
          context.fillText(text, 0, 24);

          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.scale.set(1, 0.5, 1); // Adjusted sprite scale
          return sprite;
      };

      const addLabel = (text, x, y, z, scene) => {
          const label = createTextSprite(text);
          label.position.set(x, y, z);
          scene.add(label);
      };
    
        points.forEach(({ source_latitude, source_longitude, destination_latitude, destination_longitude, source_country, destination_country }) => {
            const sourcePoint = new THREE.Mesh(pointGeometry, sourceMaterial);
            const { x: sourceX, y: sourceY, z: sourceZ } = calculatePointCoordinates(source_longitude, source_latitude);
            sourcePoint.position.set(sourceX, sourceY, sourceZ);
            scene.add(sourcePoint);
    
            const destinationPoint = new THREE.Mesh(pointGeometry, destinationMaterial);
            const { x: destinationX, y: destinationY, z: destinationZ } = calculatePointCoordinates(destination_longitude, destination_latitude);
            destinationPoint.position.set(destinationX, destinationY, destinationZ);
            scene.add(destinationPoint);
    
             // Add source country name slightly offset
             addLabel(source_country, sourceX * 1.01, sourceY * 1.01, sourceZ * 1.01, scene);

             // Add destination country name slightly offset
             addLabel(destination_country, destinationX * 1.01, destinationY * 1.01, destinationZ * 1.01, scene);// Slightly above the point

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
        const lonRad = -lon * (Math.PI / 180); // Invert longitude sign
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
            camera.position.set(4, 2, -5);

            renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
            renderer.setClearColor(0x0000); // Sky blue color
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.antialias = true;

            const earthGeometry = new THREE.SphereGeometry(4, 32, 32);
            const loader = new THREE.TextureLoader();
            const earthTexture = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg');
            // const earthTexture = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg');
            // const earthTexture = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg');
            // const earthTexture = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg');

            earthTexture.minFilter = THREE.LinearFilter;
            earthTexture.magFilter = THREE.LinearFilter;
            earthTexture.wrapS = THREE.ClampToEdgeWrapping;
            earthTexture.wrapT = THREE.ClampToEdgeWrapping;

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
    }, [points]);

    return (
        <div className="full-screen">
        <div style={{ position: 'absolute', top: 80, left: 20, padding: '20px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div className="country-container">
            <h2>TOP TARGETED COUNTRIES</h2> 
              <ul>
              {topCountries.map((item, index) => {
                console.log(item.country); // Log the country name
                return (
                  <li key={index} className={`country-item ${item.country.toLowerCase().replace(/ /g, '-')}`}>
                    <img src={item.flag} alt={`${item.country} Flag`} />
                    <span>{item.country}</span>
                    <span>{item.region}</span>
                  </li>
                );
              })}
             </ul>
        </div>
        </div>
        <div class="website-widget" onClick={handleClick}>
          Protect Yourself! <br />
          Explore our cybersecurity solutions.
        </div>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        <BottomWidget />
        </div>
    );
};

export default ThreatMap;


// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import points from './Points.json';
// import countries from './topCountries.json';
// import FlatMap from './FlatMap';
// import BottomWidget from './BottomWidget';
// import './App.css';

// const ThreatMap = () => {
//     const canvasRef = useRef(null);
//     const [topCountries, setTopCountries] = useState([]);
//     const [showFlatMap, setShowFlatMap] = useState(false);

//     const sceneRef = useRef(null);
//     const cameraRef = useRef(null);
//     const rendererRef = useRef(null);
//     const pointMeshesRef = useRef([]);
//     const arrowMeshesRef = useRef([]);

//     useEffect(() => {
//         setTopCountries(countries);
//     }, []);

//     const handleClick = () => {
//         window.open('https://www.rnstechnology.com/', '_blank');
//     };

//     const plotPoints = useCallback(() => {
//         const pointGeometry = new THREE.SphereGeometry(0.0276, 16, 16);
//         const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green for source
//         const destinationMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red for destination
//         const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue for arrow

//         const createTextSprite = (text) => {
//             const canvas = document.createElement('canvas');
//             const context = canvas.getContext('2d');
//             context.font = 'Bold 24px Arial';
//             context.fillStyle = 'rgba(255, 255, 255, 1.0)';
//             context.fillText(text, 0, 24);

//             const texture = new THREE.CanvasTexture(canvas);
//             texture.needsUpdate = true;
//             const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
//             const sprite = new THREE.Sprite(spriteMaterial);
//             sprite.scale.set(1, 0.5, 1); // Adjusted sprite scale
//             return sprite;
//         };

//         const addLabel = (text, x, y, z, scene) => {
//             const label = createTextSprite(text);
//             label.position.set(x, y, z);
//             scene.add(label);
//         };

//         points.forEach(({ source_latitude, source_longitude, destination_latitude, destination_longitude, source_country, destination_country }) => {
//             const sourcePoint = new THREE.Mesh(pointGeometry, sourceMaterial);
//             const { x: sourceX, y: sourceY, z: sourceZ } = calculatePointCoordinates(source_longitude, source_latitude);
//             sourcePoint.position.set(sourceX, sourceY, sourceZ);
//             sceneRef.current.add(sourcePoint);

//             const destinationPoint = new THREE.Mesh(pointGeometry, destinationMaterial);
//             const { x: destinationX, y: destinationY, z: destinationZ } = calculatePointCoordinates(destination_longitude, destination_latitude);
//             destinationPoint.position.set(destinationX, destinationY, destinationZ);
//             sceneRef.current.add(destinationPoint);

//             // Add source country name slightly offset
//             addLabel(source_country, sourceX * 1.01, sourceY * 1.01, sourceZ * 1.01, sceneRef.current);

//             // Add destination country name slightly offset
//             addLabel(destination_country, destinationX * 1.01, destinationY * 1.01, destinationZ * 1.01, sceneRef.current); // Slightly above the point

//             // Create animated arrow curve
//             const curvePoints = [];
//             const steps = 100;
//             for (let i = 0; i <= steps; i++) {
//                 const t = i / steps;
//                 const point = new THREE.Vector3().lerpVectors(
//                     new THREE.Vector3(sourceX, sourceY, sourceZ),
//                     new THREE.Vector3(destinationX, destinationY, destinationZ),
//                     t
//                 ).normalize().multiplyScalar(2.011); // Slightly above the surface to avoid clipping
//                 curvePoints.push(point);
//             }

//             const curve = new THREE.CatmullRomCurve3(curvePoints);
//             const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.011, 8, false); // Larger tube geometry
//             const arrowMesh = new THREE.Mesh(tubeGeometry, arrowMaterial);
//             arrowMesh.curve = curve; // Save curve for animation
//             arrowMesh.t = 0; // Initial animation parameter
//             arrowMeshesRef.current.push(arrowMesh);
//             sceneRef.current.add(arrowMesh);

//             pointMeshesRef.current.push(sourcePoint, destinationPoint);
//         });
//     }, []);

//     const calculatePointCoordinates = useCallback((lon, lat) => {
//         const lonRad = -lon * (Math.PI / 180); // Invert longitude sign
//         const latRad = lat * (Math.PI / 180);
//         const radius = 4;
//         const x = radius * Math.cos(latRad) * Math.cos(lonRad);
//         const y = radius * Math.sin(latRad);
//         const z = radius * Math.cos(latRad) * Math.sin(lonRad);
//         return { x, y, z };
//     }, []);

//     const init = useCallback(() => {
//         if (!canvasRef.current) {
//             console.error('Canvas element not found');
//             return;
//         }

//         try {
//             const canvas = canvasRef.current;
//             const existingContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
//             if (existingContext) {
//                 console.error('Canvas has an existing context of a different type');
//                 return;
//             }

//             sceneRef.current = new THREE.Scene();
//             cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//             cameraRef.current.position.set(4, 2, -5);

//             rendererRef.current = new THREE.WebGLRenderer({ canvas: canvas });
//             rendererRef.current.setClearColor(0x0000ff); // Sky blue color
//             rendererRef.current.setSize(window.innerWidth, window.innerHeight);
//             rendererRef.current.setPixelRatio(window.devicePixelRatio);
//             rendererRef.current.antialias = true;

//             const earthGeometry = new THREE.SphereGeometry(4, 32, 32);
//             const loader = new THREE.TextureLoader();
//             const earthTexture = loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg');

//             earthTexture.minFilter = THREE.LinearFilter;
//             earthTexture.magFilter = THREE.LinearFilter;
//             earthTexture.wrapS = THREE.ClampToEdgeWrapping;
//             earthTexture.wrapT = THREE.ClampToEdgeWrapping;

//             const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
//             const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
//             sceneRef.current.add(earthMesh);

//             const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
//             controls.enableDamping = true;
//             controls.dampingFactor = 0.25;
//             controls.rotateSpeed = 0.35;
//             controls.enableZoom = false;

//             const animate = () => {
//                 requestAnimationFrame(animate);

//                 // Animate arrows
//                 arrowMeshesRef.current.forEach(arrowMesh => {
//                     arrowMesh.t += 0.01;
//                     if (arrowMesh.t > 1) arrowMesh.t = 0;
//                     const point = arrowMesh.curve.getPoint(arrowMesh.t);
//                     arrowMesh.position.copy(point);
//                 });

//                 controls.update();
//                 rendererRef.current.render(sceneRef.current, cameraRef.current);
//             };

//             animate();
//         } catch (error) {
//             console.error('An error occurred while initializing the scene:', error);
//         }
//     }, []);

//     useEffect(() => {
//         if (!showFlatMap) {
//             init();
//             plotPoints();
//         }

//         return () => {
//             // Clean up the scene and renderer
//             if (rendererRef.current) {
//                 rendererRef.current.dispose();
//                 rendererRef.current.forceContextLoss();
//                 rendererRef.current = null;
//             }
//             sceneRef.current = null;
//             pointMeshesRef.current = [];
//             arrowMeshesRef.current = [];
//         };
//     }, [showFlatMap, init, plotPoints]);

//     const handleButtonClick = () => {
//         setShowFlatMap(!showFlatMap);
//     };

//     return (
//         <div>
//             <button onClick={handleButtonClick}>Toggle Map View</button>
//             <button onClick={handleClick}>Go to RNS Technology</button>
//             <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
//             {showFlatMap && <FlatMap />}
//             <BottomWidget />
//         </div>
//     );
// };

// export default ThreatMap;
