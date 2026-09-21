/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type Application, type Container } from "pixi.js";

import { Middleware } from "polymatic";

import { PixiManager, type Textures } from "./PixiManager";
import { Terminal } from "./Terminal";
import { Board } from "./Board";
import { Plane } from "./Plane";
import { LevelOne } from "./LevelOne";
import { FrameLoop } from "./FrameLoop";

export interface MainContext {
  pixi?: Application;
  scene?: Container;
  textures?: Textures;
  items?: Plane[];
}

export class Main extends Middleware<MainContext> {
  constructor() {
    super();
    this.use(new FrameLoop());
    this.use(new PixiManager());
    this.on("pixi-ready", this.handlePixiReady);
  }

  handlePixiReady = () => {
    this.use(new Terminal());
    this.use(new Board());
    this.use(new LevelOne());
  };
}
