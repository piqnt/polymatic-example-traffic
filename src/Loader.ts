/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { Middleware } from "polymatic";

import { type MainContext } from "./Main";

import bgPng from "../media/bg.png";
import map1Png from "../media/level-one.png";
import mainPng from "../media/main.png";

export class Loader extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
  }

  handleActivate = async () => {
    await Stage.atlas({
      name: "bg",
      image: { src: bgPng, ratio: 2 },
    });

    await Stage.atlas({
      name: "map",
      image: { src: map1Png, ratio: 2 },
    });

    await Stage.atlas({
      image: { src: mainPng, ratio: 4 },
      ppu: 16,
      textures: {
        plane: { x: 0, y: 0, width: 1, height: 1 },
        explode: { x: 1, y: 0, width: 3, height: 3 },
      },
    });

    this.context.stage = Stage.mount();
    this.emit("stage-ready");
  };
}
