/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Task } from "../Timeline";
import { BezierPath, Track, type Point } from "../Track";

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
    const start = this.config.runway[0];
    const end = this.config.runway[1];
    const delta = { x: end.x - start.x, y: end.y - start.y };
    this.flyPath = new Track(
      new BezierPath([
        this.plane.position,
        this.plane.position,
        {
          x: start.x - delta.x,
          y: start.y - delta.y,
        },
        start,
      ]),
      0.1,
    );
    this.taxiPath = new Track(new BezierPath([start, end]), 0.06);
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
