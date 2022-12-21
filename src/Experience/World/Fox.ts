import * as kokomi from "kokomi.js";
import * as THREE from "three";
import type * as STDLIB from "three-stdlib";
import * as dat from "lil-gui";

import Experience from "../Experience";
import Debug from "../Utils/Debug";

export default class Fox extends kokomi.Component {
  declare base: Experience;
  resource: STDLIB.GLTF;
  model: THREE.Group;
  animations: kokomi.AnimationManager;
  currentAction: THREE.AnimationAction | null;
  debug: Debug;
  debugFolder: dat.GUI | null;
  constructor(base: Experience) {
    super(base);

    this.resource = this.base.assetManager.items["foxModel"];

    this.model = this.resource.scene;
    this.model.scale.setScalar(0.02);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });

    this.animations = new kokomi.AnimationManager(
      this.base,
      this.resource.animations,
      this.resource.scene
    );
    this.currentAction = null;

    this.debug = this.base.debug;
    this.debugFolder = null;
    if (this.debug.active) {
      if (this.debug.ui) {
        this.debugFolder = this.debug.ui.addFolder("fox");
      }
    }

    this.setAnimation();
  }
  addExisting(): void {
    this.base.scene.add(this.model);
  }
  playAction(name: string) {
    if (this.currentAction) {
      this.currentAction.fadeOut(0.5);
    }
    const action = this.animations.actions[name];
    action.reset().fadeIn(0.5).play();
    this.currentAction = action;
  }
  setAnimation() {
    this.playAction("Survey");

    if (this.debug.active) {
      const debugObject = Object.fromEntries(
        this.animations.names.map((item) => [
          item,
          () => {
            this.playAction(item);
          },
        ])
      );
      Object.keys(debugObject).forEach((key) => {
        this.debugFolder?.add(debugObject, key);
      });
    }
  }
}
