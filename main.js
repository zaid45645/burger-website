import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let burger;


const mouse = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);


renderer.render(scene, camera);

const ambient_light = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambient_light);

const background_texture = new THREE.TextureLoader().load('/background.png');
scene.background = background_texture;



const model_loader = new GLTFLoader();
model_loader.load('/cheese_burger.glb', function (gltf) {
    burger = gltf.scene;
    scene.add(gltf.scene);
    burger.position.x = 3.5;
}, undefined, function (error) {
    console.error(error)
});

const zaid_geo = new RoundedBoxGeometry(2, 2, 2, 16);
const zaid_tex = new THREE.TextureLoader().load('/zaid.png');
const zaid_mat = new THREE.MeshBasicMaterial({ map: zaid_tex });
const zaid_cube = new THREE.Mesh(zaid_geo, zaid_mat);
scene.add(zaid_cube);

zaid_cube.position.setX(15);
zaid_cube.position.setZ(-5);



function addKetchup() {
    const ketchup_geo = new THREE.SphereGeometry(0.30,24, 24);
    const ketchup_mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ketchup = new THREE.Mesh(ketchup_geo, ketchup_mat);

    const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

    ketchup.position.set(x, y, z);
    scene.add(ketchup);
}

Array(200).fill().forEach(addKetchup);

function animate() {
    renderer.render(scene, camera);
    if (burger) {
         burger.rotation.y += 0.01;
         burger.rotation.z += 0.00001;
    }

}


function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    const baseZ = 10;
    camera.position.z = baseZ + (t * 0.004); 
    camera.position.y = t * -0.0003; 
    camera.position.x = t * -0.0009;

    zaid_cube.rotation.y += 0.01;
    zaid_cube.rotation.x += 0.01;
    zaid_cube.position.x -= 0.1;
}

document.body.onscroll = moveCamera;
moveCamera();

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0,0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        moveCamera();
    }, 50);
});