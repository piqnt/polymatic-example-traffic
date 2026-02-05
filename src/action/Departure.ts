/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Task } from "../Timeline";
import { BezierPath, LinePath, Track, type Point } from "../Track";

export interface DepartureConfig {
  type: "departure";
  runway: [Point, Point];
  exit: Point;
}

export class DepartureTask implements Task {
  name = "departure";
  taxiPath: Track;
  flyPath: Track;

  started: boolean;
  finished: boolean;
  plane: Plane;
  config: DepartureConfig;

  constructor(plane: Plane, config: DepartureConfig) {
    this.plane = plane;
    this.config = config;
  }

  start = () => {
    this.taxiPath = new Track(new LinePath([this.config.runway[0], this.config.runway[1]]), 0.09);
    this.flyPath = new Track(
      new BezierPath([
        this.config.runway[1],
        {
          x: 2 * this.config.runway[1].x - 1 * this.config.runway[0].x,
          y: 2 * this.config.runway[1].y - 1 * this.config.runway[0].y,
        },
        this.config.exit,
        this.config.exit,
      ]),
      0.1,
    );
  };

  step = () => {
    if (this.taxiPath.progress < 1) {
      this.plane.z = 0.5;
      this.plane.track = this.taxiPath;
    } else if (this.flyPath.progress < 1) {
      this.plane.z = 1;
      this.plane.track = this.flyPath;
    } else {
      this.plane.track = null;
      this.plane.delete = true;
      // item.action = null;
      this.finished = true;
    }
  };
}
