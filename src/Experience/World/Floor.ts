import * as kokomi from "kokomi.js";
import * as THREE from "three";
import type * as STDLIB from "three-stdlib";
import * as dat from "lil-gui";

import Experience from "../Experience";
import Debug from "../Utils/Debug";

export default class Floor extends kokomi.Component {
  declare base: Experience;
  geometry: THREE.CircleGeometry;
  textures: Record<string, THREE.Texture>;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh;
  constructor(base: kokomi.Base) {
    super(base);

    this.geometry = new THREE.CircleGeometry(5, 64);

    this.textures = {};

    this.textures.color = this.base.assetManager.items["grassColorTexture"];
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.base.assetManager.items["grassNormalTexture"];
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
  }
  addExisting(): void {
    this.base.scene.add(this.mesh);
  }
}
