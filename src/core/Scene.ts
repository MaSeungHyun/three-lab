import * as THREE from "three";
import JEASINGS from "jeasings";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  DEFAULT_SCENE_BACKGROUND,
  GRID_COLOR,
  GRID_DIVISION,
  GRID_SIZE,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  INIT_CAMERA_POSITION_DURATION,
  INIT_CAMERA_TARGET_POSITION,
  DEFAULT_CAMERA_POSITION,
} from "../constants/scene";

export class Scene {
  public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  public scene: THREE.Scene = new THREE.Scene();
  public sceneHelper: THREE.Scene = new THREE.Scene();
  public camera: THREE.PerspectiveCamera | null = null;
  public controls: OrbitControls | null = null;
  public grid: THREE.GridHelper | null = null;
  public dom: HTMLDivElement | null = null;

  constructor() {
    this.scene.background = new THREE.Color(DEFAULT_SCENE_BACKGROUND);
    this.scene.fog = new THREE.Fog(DEFAULT_SCENE_BACKGROUND, 0.1, 1000);
    this.sceneHelper.background = null;
    this.sceneHelper.fog = new THREE.Fog(DEFAULT_SCENE_BACKGROUND, 0.1, 75);

    this.grid = new THREE.GridHelper(
      GRID_SIZE,
      GRID_DIVISION,
      GRID_COLOR,
      GRID_COLOR
    );
    this.sceneHelper.add(this.grid);
    this.initProject();
  }

  public initProject() {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: "white" });
    const cube = new THREE.Mesh(box, material);

    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(2, 10, 1);
    this.scene.add(cube);
    this.scene.add(light);
  }

  public didMount(dom: HTMLDivElement) {
    this.dom = dom;

    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      dom.clientWidth / dom.clientHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );

    this.camera.position.set(
      DEFAULT_CAMERA_POSITION.x,
      DEFAULT_CAMERA_POSITION.y,
      DEFAULT_CAMERA_POSITION.z
    );

    initCameraPosition(this.camera);

    this.renderer.setSize(dom.clientWidth, dom.clientHeight);
    dom.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.addEventListener("change", () => {});

    this.renderer.setAnimationLoop(() => {
      this.render();
    });
  }

  public render() {
    this.renderer.autoClear = false;
    this.renderer.render(this.scene, this.camera!);
    this.renderer.render(this.sceneHelper, this.camera!);

    this.resize();

    JEASINGS.update();
  }

  public resize() {
    this.camera!.aspect = this.dom!.clientWidth / this.dom!.clientHeight;
    this.camera!.updateProjectionMatrix();
    this.controls!.update();
  }

  public dispose() {
    this.renderer.dispose();
    this.controls?.dispose();
    this.grid?.dispose();
    if (this.dom) {
      this.dom.removeChild(this.renderer.domElement);
    }
  }
}

function initCameraPosition(camera: THREE.PerspectiveCamera) {
  new JEASINGS.JEasing(camera.position)
    .to(
      {
        x: INIT_CAMERA_TARGET_POSITION.x,
        y: INIT_CAMERA_TARGET_POSITION.y,
        z: INIT_CAMERA_TARGET_POSITION.z,
      },
      INIT_CAMERA_POSITION_DURATION
    )
    .start();
}
