/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { Middleware } from "polymatic";

import { Loader } from "./Loader";
import { Terminal } from "./Terminal";
import { Board } from "./Board";
import { Plane } from "./Plane";
import { LevelOne } from "./LevelOne";
import { FrameLoop } from "./FrameLoop";

export interface MainContext {
  stage?: Stage.Root;
  items?: Plane[];
}

export class Main extends Middleware<MainContext> {
  constructor() {
    super();
    this.use(new FrameLoop());
    this.use(new Loader());
    this.on("stage-ready", this.handleStageReady);
  }

  handleStageReady = () => {
    this.use(new Terminal());
    this.use(new Board());
    this.use(new LevelOne());
  };
}
