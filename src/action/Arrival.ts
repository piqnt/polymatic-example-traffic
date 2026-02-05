/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Task } from "../Timeline";
import { BezierPath, LinePath, Track, type Point } from "../Track";

export interface ArrivalConfig {
  type: "arrival";
  runway: [Point, Point];
}

export class ArrivalAction implements Task {
  name = "arrival";
  flyPath: Track;
  taxiPath: Track;

  started: boolean;
  finished: boolean;
  plane: Plane;
  config: ArrivalConfig;

  constructor(plane: Plane, config: ArrivalConfig) {
    this.plane = plane;
    this.config = config;
  }

  start = () => {
    this.flyPath = new Track(
      new BezierPath([
        this.plane.position,
        this.plane.position,
        {
          x: 2 * this.config.runway[0].x - 1 * this.config.runway[1].x,
          y: 2 * this.config.runway[0].y - 1 * this.config.runway[1].y,
        },
        this.config.runway[0],
      ]),
      0.1,
    );
    this.taxiPath = new Track(new LinePath([this.config.runway[0], this.config.runway[1]]), 0.06);
  };

  step = () => {
    if (this.flyPath.progress < 1) {
      this.plane.z = 1;
      this.plane.track = this.flyPath;
    } else if (this.taxiPath.progress < 1) {
      this.plane.z = 0.5;
      this.plane.track = this.taxiPath;
    } else {
      this.plane.track = null;
      this.finished = true;
    }
  };
}
