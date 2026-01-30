/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Middleware } from "polymatic";

import { type MainContext } from "./Main";
import { Calc } from "./Calc";
import { type Point } from "./Track";
import { Plane } from "./Plane";
import { type FrameLoopEvent } from "./FrameLoop";

/**
 * Implements adding planes to the board with specific actions.
 */
export class LevelOne extends Middleware<MainContext> {
  globalTime = 0;
  nextPlaneTime = 0;

  runway: [Point, Point] = [
    { x: -66, y: -111 },
    { x: 132, y: -2 },
  ];
  southPoint = { x: 52, y: 120 };
  chargerPoint = { x: -38, y: 68 };
  westPoint = { x: -141, y: 2 };
  holdPoint = { x: -78, y: -91 };

  constructor() {
    super();
    this.on("activate", this.handleActivate);
    this.on("frame-update", this.handleFrameUpdate);
  }

  handleActivate = () => {
    this.context.items = [];
  };

  handleFrameUpdate = (ev: FrameLoopEvent) => {
    this.globalTime += ev.dt;

    if (this.globalTime > this.nextPlaneTime) {
      const plane = this.getNextPlane();
      this.context.items.push(plane);
      this.nextPlaneTime += this.nextPlaneInterval();
    }
  };

  getNextPlane = () => {
    const plane = new Plane();

    plane.actions = [
      {
        type: "enter",
        enter: {
          x: -500,
          y: Calc.randomNumber(-200, 200),
        },
      },
      {
        type: "arrival",
        runway: this.runway,
      },
      {
        type: "taxi",
        to: this.southPoint,
      },
      {
        type: "taxi",
        to: this.chargerPoint,
      },
      {
        type: "delay",
        time: 1000,
      },
      {
        type: "taxi",
        to: this.westPoint,
      },
      {
        type: "taxi",
        to: this.holdPoint,
      },
      {
        type: "hold",
      },
      {
        type: "taxi",
        to: this.runway[0],
      },
      {
        type: "departure",
        runway: this.runway,
        exit: {
          x: 500,
          y: Calc.randomNumber(-300, 300),
        },
      },
    ];

    return plane;
  };

  nextPlaneInterval() {
    return Calc.randomNumber() * 3000 + 5000;
  }
}
