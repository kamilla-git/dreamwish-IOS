import React, { useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

function Fireflies({ count = 40 }) {
  const points = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const x = i * 3;
      const y = i * 3 + 1;
      points.current.geometry.attributes.position.array[y] += Math.sin(time + i) * 0.01;
      points.current.geometry.attributes.position.array[x] += Math.cos(time + i) * 0.005;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#fbbf24"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingModel({ position, color, type }: { position: [number, number, number], color: string, type: 'box' | 'sphere' }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = t * 0.2;
    mesh.current.rotation.y = t * 0.3;
    mesh.current.position.y = position[1] + Math.sin(t + position[0]) * 0.5;
  });

  return (
    <mesh ref={mesh} position={position}>
      {type === 'box' ? <boxGeometry args={[0.5, 0.5, 0.5]} /> : <sphereGeometry args={[0.3, 16, 16]} />}
      <meshStandardMaterial color={color} transparent opacity={0.3} wireframe />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Fireflies />
        <FloatingModel position={[-2, 3, 0]} color="#fbbf24" type="box" />
        <FloatingModel position={[2, -4, 0]} color="#34d399" type="sphere" />
        <FloatingModel position={[-3, -2, -2]} color="#fbbf24" type="sphere" />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#022c22',
  },
});