import React, { useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { geoEquirectangular } from 'd3-geo';

// Earth component to load and display the texture
const Earth = ({ texture }) => {
  const earthTexture = useLoader(TextureLoader, texture);

  return (
    <mesh>
      <planeGeometry args={[10, 5]} />
      <meshBasicMaterial map={earthTexture} />
    </mesh>
  );
};

// Point component to place markers on the map
const Point = ({ lat, lon }) => {
  const projection = useMemo(() => geoEquirectangular().translate([5, 2.5]).scale(1.5925), []);
  const [x, y] = projection([lon, lat]);

  return (
    <mesh position={[x - 5, 2.5 - y, 0.1]}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
};

// Main FlatMap component
const FlatMap = () => {
  const points = [
    { lat: 37.7749, lon: -122.4194 }, // San Francisco
    { lat: 51.5074, lon: -0.1278 },   // London
    { lat: 40.7128, lon: -74.0060 },  // New York
    { lat: 35.6895, lon: 139.6917 },  // Tokyo
    { lat: -33.8688, lon: 151.2093 }, // Sydney
    { lat: 23.885942, lon: 45.079162 }, // Suadi
    { lat: 33.854721, lon: 35.862285 }, // Leb

    // Add more points as needed
  ];

  return (
    <Canvas style={{ height: '100vh', width: '100vw', background: '#1e1e1e' }}>
      <ambientLight intensity={0.5} />
      <Earth texture="https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg" />
      {points.map((point, index) => (
        <Point key={index} lat={point.lat} lon={point.lon} />
      ))}
      <OrbitControls enableRotate={false} enableZoom={false} />
    </Canvas>
  );
};

export default FlatMap;
