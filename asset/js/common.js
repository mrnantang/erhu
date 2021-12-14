import * as THREE from "./three.module.js";
import { FBXLoader } from "./FBXLoader.js";
let camera, scene, renderer;
let mouse = new THREE.Vector2();
let mixer;
let actions = []; //所有的动画数组;
const clock = new THREE.Clock();
let init = function init() {
    // 插入标签
    const container = document.getElementById("models");
    // 相机
    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(0, 100, 400);

    // 场景
    scene = new THREE.Scene();
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    // 光源
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);

    // 环境
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    // 网格
    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    grid.material.transparent = true;
    // 渲染
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    renderer.domElement.addEventListener("mousedown", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
   setTimeout(() => {
    loadFbxInScence();
   }, 1500);
  }
     // 加载模型
     function loadFbxInScence() {
        // 模型
        const loader = new FBXLoader();
        // 导入模型
        const getTexture = new THREE.TextureLoader().load(
          // 导入贴图
          "../../asset/model/DrF_DefaultMaterial_Diffuse.png"
        );
        const getNTexture = new THREE.TextureLoader().load(
          // 导入贴图
          "../../asset/model/DrF_DefaultMaterial_Normal.png"
        );

        let asd = [0,2.2];
        // 导入模型
        loader.load("../../asset/model/法兰克博士@ani12.14+++.fbx", (object) => {
          mixer = new THREE.AnimationMixer(object);
          for (let i = 0; i < object.animations.length; i++) {
            actions[i] = mixer.clipAction(object.animations[i]);
            // 加载并播放默认动画
            actions[i].time = asd[i];
          }
          actions[1].setLoop(THREE.LoopOnce);
          mixer.addEventListener("finished", function (e) {
            actions[1].reset();
            actions[1].time = asd[1];
            actions[1].play();
          });
          actions[0].play()

          object.traverse((child) => {
            let material = new THREE.MeshPhongMaterial({
              map: getTexture,
              normalMap: getNTexture,
              transparent: true,
            });
            child.material = material;
          });
          object.scale.setScalar(2);
          object.position.set(0, -20, 0);
          scene.add(object);
        }
        );
      }
     let animate = function animate() {
        requestAnimationFrame(animate);
        // 让模型动起来
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.clear();
        renderer.render(scene, camera);
      }
    export {animate,init,actions}