import * as THREE from "three";
import "/css/style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();

// Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const atmoGeometry = new THREE.SphereGeometry(3.08, 64, 64);
// Load the image texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("images/physical-world-map.jpg");

const material = new THREE.MeshStandardMaterial({ map: texture });
const atmoMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0.2,
});

const globe = new THREE.Mesh(geometry, material);
const atmo = new THREE.Mesh(atmoGeometry, atmoMaterial);

scene.add(globe);
scene.add(atmo);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const ambientLight = new THREE.AmbientLight(0x404040); // You can adjust the color as needed
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 3, 100);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
camera.position.x = 7;

scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Update light position in the loop
const loop = () => {
  controls.update();

  // Earth's position in the scene
  const earthPosition = new THREE.Vector3(0, 0, 0);

  // Set the sun position based on Earth's position and current time
  const time = performance.now() * 0.00001; // Adjust the speed of rotation
  const sunRadius = 30; // Distance from the Earth
  const sunPosition = new THREE.Vector3(
    sunRadius * Math.cos(time),
    10,
    sunRadius * Math.sin(time)
  );

  light.position.copy(earthPosition).add(sunPosition);

  // Rotate the Earth
  globe.rotation.y += 0.001; // Adjust the speed of rotation

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();
