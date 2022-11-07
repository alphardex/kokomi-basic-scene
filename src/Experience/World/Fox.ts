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
  animation: Partial<{
    mixer: THREE.AnimationMixer;
    actions: Record<string, THREE.AnimationAction>;
    play: Function;
  }>;
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

    this.animation = {};

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
  update(time: number): void {
    this.animation.mixer?.update(this.base.clock.deltaTime);
  }
  setAnimation() {
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {};
    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name: string) => {
      if (this.animation.actions) {
        const newAction = this.animation.actions[name];
        const oldAction = this.animation.actions.current;

        if (oldAction) {
          newAction.reset();
          newAction.play();
          newAction.crossFadeFrom(oldAction, 1, false);

          this.animation.actions.current = newAction;
        }
      }
    };

    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          if (this.animation.play) {
            this.animation.play("idle");
          }
        },
        playWalking: () => {
          if (this.animation.play) {
            this.animation.play("walking");
          }
        },
        playRunning: () => {
          if (this.animation.play) {
            this.animation.play("running");
          }
        },
      };
      Object.keys(debugObject).forEach((key) => {
        this.debugFolder?.add(debugObject, key);
      });
    }
  }
}
