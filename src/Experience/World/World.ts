import * as kokomi from "kokomi.js";

import Experience from "../Experience";

import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World extends kokomi.Component {
  declare base: Experience;
  environment: Environment | null;
  floor: Floor | null;
  fox: Fox | null;
  constructor(base: Experience) {
    super(base);

    this.environment = null;
    this.floor = null;
    this.fox = null;

    this.base.assetManager.on("ready", () => {
      this.floor = new Floor(this.base);
      this.floor.addExisting();

      this.fox = new Fox(this.base);
      this.fox.addExisting();

      this.environment = new Environment(this.base);
      this.environment.addExisting();
    });
  }
}
