/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Sprite } from "pixi.js";

import { Binder, Driver, Middleware } from "polymatic";

import { type MainContext } from "./Main";
import { Plane } from "./Plane";
import { type Point } from "./Track";
import { Calc } from "./Calc";
import { type FrameLoopEvent } from "./FrameLoop";
import { TransitionManager } from "@piqnt/transition";

// the viewbox covers the screen, the larger screen dimension is fitted to this many scene units
const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 800;

export class Terminal extends Middleware<MainContext> {
  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("deactivate", this.handleDeactivate);
    this.on("frame-render", this.handleFrameRender);
  }

  handleActivate = () => {
    const pixi = this.context.pixi;
    const scene = this.context.scene;
    const textures = this.context.textures;

    pixi.renderer.on("resize", this.handleViewport);
    this.handleViewport();

    const bg = new Sprite(textures.bg);
    bg.anchor.set(0.5);
    scene.addChild(bg);

    const map = new Sprite(textures.map);
    map.anchor.set(0.5);
    scene.addChild(map);

    // receive pointer events anywhere on the screen, not just on sprites
    pixi.stage.eventMode = "static";
    pixi.stage.hitArea = pixi.screen;
    pixi.stage.on("pointertap", this.handleClick);
  };

  handleDeactivate = () => {
    this.context.pixi?.renderer.off("resize", this.handleViewport);
  };

  /**
   * Fit the viewbox to cover the screen, and center scene origin on the screen.
   */
  handleViewport = () => {
    const pixi = this.context.pixi;
    const scene = this.context.scene;

    const screenWidth = pixi.screen.width;
    const screenHeight = pixi.screen.height;

    const scale = Math.max(screenWidth / VIEWBOX_WIDTH, screenHeight / VIEWBOX_HEIGHT);
    scene.scale.set(scale);
    scene.position.set(screenWidth / 2, screenHeight / 2);
  };

  handleClick = () => {
    this.emit("user-click");
  };

  handleFrameRender = (ev: FrameLoopEvent) => {
    this.binder.data([...this.context.items]);
    this.transitionManager.update(ev.dt);
  };

  transitionManager = new TransitionManager();

  explode = (point: Point, delay = 0) => {
    const sprite = new Sprite(this.context.textures.explode);
    sprite.anchor.set(0.5);
    sprite.rotation = Math.random() * 6.28;
    sprite.position.set(point.x, point.y);
    // invisible until the transition starts, after delay
    sprite.alpha = 0;
    sprite.scale.set(0.3);
    this.context.scene.addChild(sprite);

    this.transitionManager
      .select(sprite)
      .tween(Calc.randomNumber(80, 120), delay)
      .to({ alpha: 1, scale: { x: 0.5, y: 0.5 } })
      .tween(Calc.randomNumber(250, 350))
      .to({ alpha: 0.4, scale: { x: 1, y: 1 } })
      .tween(Calc.randomNumber(250, 350))
      .to({ alpha: 0, scale: { x: 1.5, y: 1.5 } })
      .done(() => {
        sprite.removeFromParent();
        sprite.destroy();
      });
  };

  planeRender = Driver.create<Plane, Sprite>({
    filter: (plane) => plane.type === "plane",
    enter: (plane) => {
      const ui = new Sprite(this.context.textures.plane);
      ui.anchor.set(0.5);
      ui.eventMode = "static";
      ui.cursor = "pointer";
      ui.on("pointertap", () => {
        this.emit("user-click-plane", plane);
      });
      this.context.scene.addChild(ui);
      return ui;
    },
    update: (plane, ui) => {
      if (plane.position) {
        ui.position.set(plane.position.x, plane.position.y);
        ui.rotation = plane.angle;
        ui.visible = true;
      } else {
        ui.visible = false;
      }
    },
    exit: (plane, ui) => {
      ui.removeFromParent();
      ui.destroy();
      if (plane.exploded) {
        this.explode(plane.position);
        this.explode(plane.position, Math.random() * 200);
      }
    },
  });

  binder = Binder.create<Plane>({
    key: (obj) => obj.key,
    drivers: [this.planeRender],
  });
}
