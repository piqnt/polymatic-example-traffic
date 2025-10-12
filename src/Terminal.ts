/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Stage from "stage-js";

import { Binder, Driver, Middleware } from "polymatic";

import { type MainContext } from "./Main";
import { Plane } from "./Plane";
import { type Point } from "./Track";
import { Calc } from "./Calc";

export class Terminal extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("stage-ready", this.handleStageReady);
  }

  handleActivate = () => {};

  handleStageReady = () => {
    this.context.stage.background("#222222");
    this.context.stage.viewbox(800, 800, "out-crop").pin("align", -0.5);
    this.context.stage.MAX_ELAPSE = 20;

    const bg = Stage.sprite("bg");
    bg.appendTo(this.context.stage);
    bg.pin("handle", 0.5);

    const map = Stage.sprite("map");
    map.pin({
      align: 0,
      handle: 0.5,
    });
    map.appendTo(this.context.stage);

    this.context.stage.on("click", this.handleClick);
    this.context.stage.tick(this.handleTick);
  };

  handleClick = () => {
    this.emit("user-click");
  };

  handleTick = (dt: number) => {
    this.emit("terminal-tick", dt);
    this.update();
    return true;
  };

  update = () => {
    this.binder.data([...this.context.items]);
  };

  explode = (point: Point) => {
    const explode = Stage.sprite("explode");
    explode.appendTo(this.context.stage);
    explode.rotate(Math.random() * 6.28);
    explode.pin({
      handle: 0.5,
      offsetX: point.x,
      offsetY: point.y,
      alpha: 0.1,
      scale: 0.3,
    });
    explode
      .tween(Calc.randomNumber(80, 120))
      .pin({ alpha: 1, scale: 0.5 })
      .tween(Calc.randomNumber(250, 350))
      .pin({ alpha: 0.4, scale: 1 })
      .tween(Calc.randomNumber(250, 350))
      .pin({ alpha: 0, scale: 1.5 })
      .remove();
  };

  planeRender = Driver.create<Plane, Stage.Sprite>({
    filter: (plane) => plane.type === "plane",
    enter: (plane) => {
      let ui = Stage.sprite("plane");
      ui.pin("handle", 0.5);
      ui.on("click", () => {
        this.emit("user-click-plane", plane);
      });
      ui.appendTo(this.context.stage);
      return ui;
    },
    update: (plane, ui) => {
      if (plane.position) {
        ui.offset(plane.position);
        ui.rotate(plane.angle);  
        ui.visible(true);
      } else {
        ui.visible(false);
      }
    },
    exit: (plane, ui) => {
      ui.remove();
      if (plane.exploded) {
        this.explode(plane.position);
        setTimeout(() => this.explode(plane.position), Math.random() * 200);
      }
    },
  });

  binder = Binder.create<Plane>({
    key: (obj) => obj.key,
    drivers: [this.planeRender],
  });
}
