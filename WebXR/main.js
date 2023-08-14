import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

let scene, camera, renderer, cube;

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // WebXR setup
    const arButton = document.getElementById('enter-ar-button');
    arButton.addEventListener('click', () => {
        if (navigator.xr) {
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                if (supported) {
                    arButton.style.display = 'none';
                    initAR();
                } else {
                    alert('Immersive AR is not supported on this device.');
                }
            });
        } else {
            alert('WebXR is not available on this browser.');
        }
    });
}

async function initAR() {
    const session = await navigator.xr.requestSession('immersive-ar');
    renderer.xr.setSession(session);

    // Position the cube in AR
    cube.position.set(0, 0, -2);
    scene.add(cube);

    // Handle the session's end
    session.addEventListener('end', () => {
        // Clean up any resources or listeners
        cube.position.set(0, 0, 0);
        arButton.style.display = 'block';
    });
}

function animate() {
    renderer.setAnimationLoop(() => {
        render();
    });
}

function render() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
