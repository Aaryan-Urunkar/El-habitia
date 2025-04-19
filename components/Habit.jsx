import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function ModelView() {
  const glRef = useRef();

  async function loadModel(scene) {
    const modelAsset = Asset.fromModule(require('@/assets/models/computer.gltf'));
    await modelAsset.downloadAsync();

    const loader = new GLTFLoader();

    try {
      const gltf = await loader.loadAsync(modelAsset.localUri);

      // Optional debug
      console.log('Model loaded:', gltf.scene);

      // Scale and reposition model
      gltf.scene.scale.set(0.1, 0.1, 0.1);
      gltf.scene.position.set(0, -1, 0);
      gltf.scene.rotation.y = Math.PI; // 180° flip


      // Replace material (in case it's incompatible)
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        }
      });

      scene.add(gltf.scene);
    } catch (err) {
      console.error('Error loading model:', err);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          const scene = new THREE.Scene();

          const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
          );
          camera.position.set(0, 0, 3);
          camera.lookAt(new THREE.Vector3(0, 0, 0));

          const renderer = new Renderer({ gl });
          renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

          // Lights
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
          scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(0, 1, 2).normalize();
          scene.add(directionalLight);

          // Axes helper for orientation
          const axesHelper = new THREE.AxesHelper(2);
          scene.add(axesHelper);

          // Load the model
          await loadModel(scene);

          const render = () => {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            gl.endFrameEXP();
          };

          render();
        }}
      />
    </View>
  );
}
