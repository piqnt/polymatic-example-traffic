/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Main";
import { Calc } from "./Calc";
import { Plane } from "./Plane";
import { type FrameLoopEvent } from "./FrameLoop";
import { ActionFactory } from "./Action";

/**
 * Implements adding planes to the board with specific actions.
 */
export class LevelOne extends Middleware<MainContext> {
  nextPlaneTimeout = 0;

  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("frame-update", this.handleFrameUpdate);
  }

  handleActivate = () => {
    this.context.items = [];
  };

  handleFrameUpdate = (ev: FrameLoopEvent) => {
    this.nextPlaneTimeout -= ev.dt;

    if (this.nextPlaneTimeout < 0) {
      const plane = this.getNextPlane();
      this.context.items.push(plane);
      this.nextPlaneTimeout = this.nextPlaneInterval();
    }
  };

  getNextPlane = () => {
    const plane = new Plane();
    plane.timeline = L1Tasks.map((config) => ActionFactory[config.type](plane, config));
    return plane;
  };

  nextPlaneInterval() {
    return Calc.randomNumber() * 3000 + 5000;
  }
}

const L1Map = {
  runway: [
    { x: -66, y: -111 },
    { x: 132, y: -2 },
  ],
  southPoint: { x: 52, y: 120 },
  chargerPoint: { x: -38, y: 68 },
  westPoint: { x: -141, y: 2 },
  holdPoint: { x: -78, y: -91 },
};

const L1Tasks = [
  {
    type: "enter",
    location: {
      x: -500,
      y: Calc.randomNumber(-200, 200),
    },
  },
  {
    type: "arrival",
    runway: L1Map.runway,
  },
  {
    type: "taxi",
    to: L1Map.southPoint,
  },
  {
    type: "taxi",
    to: L1Map.chargerPoint,
  },
  {
    type: "delay",
    time: 1000,
  },
  {
    type: "taxi",
    to: L1Map.westPoint,
  },
  {
    type: "taxi",
    to: L1Map.holdPoint,
  },
  {
    type: "hold",
  },
  {
    type: "taxi",
    to: L1Map.runway[0],
  },
  {
    type: "departure",
    runway: L1Map.runway,
    exit: {
      x: 500,
      y: Calc.randomNumber(-300, 300),
    },
  },
];
