import * as kokomi from "kokomi.js";
import * as THREE from "three";
import type * as STDLIB from "three-stdlib";
import * as dat from "lil-gui";

import Experience from "../Experience";
import Debug from "../Utils/Debug";

export default class Environment extends kokomi.Component {
  declare base: Experience;
  sunLight: THREE.DirectionalLight | null;
  environmentMap: Partial<{
    texture: THREE.Texture;
    intensity: number;
    updateMaterials: Function;
  }>;
  debug: Debug;
  debugFolder: dat.GUI | null;
  constructor(base: Experience) {
    super(base);

    this.sunLight = null;

    this.environmentMap = {};

    this.debug = this.base.debug;
    this.debugFolder = null;
    if (this.debug.active) {
      if (this.debug.ui) {
        this.debugFolder = this.debug.ui.addFolder("environment");
      }
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }
  addExisting(): void {
    if (this.sunLight) {
      this.base.scene.add(this.sunLight);
    }

    if (this.environmentMap.texture) {
      this.base.scene.environment = this.environmentMap.texture;
    }
  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.position.set(3.5, 2, -1.25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;

    if (this.debug.active) {
      this.debugFolder
        ?.add(this.sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        ?.add(this.sunLight.position, "x")
        .name("sunLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        ?.add(this.sunLight.position, "y")
        .name("sunLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        ?.add(this.sunLight.position, "z")
        .name("sunLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }
  setEnvironmentMap() {
    this.environmentMap.texture =
      this.base.assetManager.items["environmentMapTexture"];
    this.environmentMap.intensity = 0.4;
    this.environmentMap.updateMaterials = () => {
      this.base.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          if (this.environmentMap.texture) {
            child.material.envMap = this.environmentMap.texture;
          }
          if (this.environmentMap.intensity) {
            child.material.envMapIntensity = this.environmentMap.intensity;
          }
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();

    if (this.debug.active) {
      this.debugFolder
        ?.add(this.environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(() => {
          if (this.environmentMap.updateMaterials) {
            this.environmentMap.updateMaterials();
          }
        });
    }
  }
}
