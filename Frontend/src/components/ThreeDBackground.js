import React, { useRef, useEffect } from 'react';
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
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    useEffect(() => {
        // Scene, Camera, and Renderer Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 4);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.setPixelRatio(window.devicePixelRatio);

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }

        // HDRI Environment
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load('/assets/rogland_clear_night_1k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
        });

        // Texture Loader
        const textureLoader = new TextureLoader();
        const emissiveTexture = textureLoader.load('/models/Default_emissive.jpg');
        const normalTexture = textureLoader.load('/models/Default_normal.jpg');

        // GLTF Model Loader
        let model;
        const loader = new GLTFLoader();
        loader.load(
            '/models/DamagedHelmet.gltf',
            (gltf) => {
                model = gltf.scene;

                // Reset rotation, adjust orientation, and scaling
                model.rotation.set(Math.PI / 2, Math.PI, 0); // Adjust orientation
                model.scale.set(1, 1, 1); // Ensure correct scaling

                // Traverse the model and apply textures
                model.traverse((child) => {
                    if (child.isMesh && child.material) {
                        if ('emissiveMap' in child.material) {
                            child.material.emissiveMap = emissiveTexture;
                        }
                        if ('normalMap' in child.material) {
                            child.material.normalMap = normalTexture;
                        }
                        child.material.needsUpdate = true;

                        // Ensure normals are correct
                        child.material.side = THREE.FrontSide; // Use DoubleSide if needed
                    }
                });

                scene.add(model);
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model:', error);
            }
        );

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Postprocessing
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        const rgbShiftPass = new ShaderPass(RGBShiftShader);
        rgbShiftPass.uniforms['amount'].value = 0.0025; // Adjust the amount of RGB shift
        composer.addPass(rgbShiftPass);

        // Create Starfield for background
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

        // Mouse Move Event
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', onMouseMove);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object;

                // Ensure the intersected object has a material before calling setHex
                if (intersectedObject.material && intersectedObject.material.emissive) {
                    intersectedObject.material.emissive.setHex(0xff0000); // Example: change color on hover
                }
            } else if (model) {
                // Reset the color if no intersection
                model.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.emissive.setHex(0x000000);
                    }
                });
            }

            // Rotate star field for a dynamic effect
            starField.rotation.x += 0.0005;
            starField.rotation.y += 0.0005;

            // Make the model rotate slightly based on mouse position
            if (model) {
                model.rotation.y = (mouse.x * 0.35); // Adjust the rotation speed as needed
                model.rotation.x = -(mouse.y * 0.35); // Adjust the rotation speed as needed
            }

            composer.render();
        };

        animate();

        // Window Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
        />
    );
};

export default ThreeDBackground;
