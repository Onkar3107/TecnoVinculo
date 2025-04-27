import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';

const ThreeDBackground = () => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false); // 🆕 for smooth fade

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/assets/rogland_clear_night_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const textureLoader = new TextureLoader();
    const emissiveTexture = textureLoader.load('/models/Default_emissive.jpg');
    const normalTexture = textureLoader.load('/models/Default_normal.jpg');

    let model;
    const loader = new GLTFLoader();
    loader.load(
      '/models/DamagedHelmet.gltf',
      (gltf) => {
        model = gltf.scene;

        model.rotation.set(Math.PI / 2, Math.PI, 0);
        model.scale.set(1, 1, 1);

        model.traverse((child) => {
          if (child.isMesh && child.material) {
            if ('emissiveMap' in child.material) {
              child.material.emissiveMap = emissiveTexture;
            }
            if ('normalMap' in child.material) {
              child.material.normalMap = normalTexture;
            }
            child.material.needsUpdate = true;
            child.material.side = THREE.FrontSide;
          }
        });

        scene.add(model);

        // 🆕 Smooth Fade-Out Loader
        setFadeOut(true); 
        setTimeout(() => setLoading(false), 1000); // wait for fade animation
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setFadeOut(true);
        setTimeout(() => setLoading(false), 1000);
      }
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0025;
    composer.addPass(rgbShiftPass);

    const starFieldGeometry = new THREE.BufferGeometry();
    const starFieldMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
    });

    const stars = [];
    for (let i = 0; i < 10000; i++) {
      const star = new THREE.Vector3(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
      );
      stars.push(star.x, star.y, star.z);
    }

    starFieldGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    const starField = new THREE.Points(starFieldGeometry, starFieldMaterial);
    scene.add(starField);

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.material && intersectedObject.material.emissive) {
          intersectedObject.material.emissive.setHex(0xff0000);
        }
      } else if (model) {
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.emissive.setHex(0x000000);
          }
        });
      }

      starField.rotation.x += 0.0005;
      starField.rotation.y += 0.0005;

      if (model) {
        model.rotation.y = mouse.x * 0.35;
        model.rotation.x = -mouse.y * 0.35;
      }

      composer.render();
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, #000000 0%, #1a1a1a 100%)',
            overflow: 'hidden',
            zIndex: 9998,
            opacity: fadeOut ? 0 : 1, 
            transition: 'opacity 1s ease-out' // 🆕 smooth fade
          }}
        >
          {/* Particle Stars */}
          {[...Array(100)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              backgroundColor: 'white',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `moveStar ${5 + Math.random() * 5}s linear infinite`
            }} />
          ))}

          {/* Center Loader */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '30px',
            borderRadius: '15px',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '6px solid #00ffff',
              borderTop: '6px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#ffffff', marginTop: '15px', fontSize: '18px' }}>Loading 3D Scene...</p>
          </div>
        </div>
      )}

      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
    </>
  );
};

export default ThreeDBackground;
