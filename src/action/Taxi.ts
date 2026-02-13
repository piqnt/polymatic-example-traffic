/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Task } from "../Timeline";
import { BezierPath, Track, type Point } from "../Track";

export interface TaxiConfig {
  type: "taxi";
  to: Point;
}

export class TaxiTask implements Task {
  name = "taxi";
  taxiPath: Track;

  started: boolean;
  finished: boolean;
  plane: Plane;
  config: TaxiConfig;

  constructor(plane: Plane, config: TaxiConfig) {
    this.plane = plane;
    this.config = config;
  }

  start = () => {
    this.taxiPath = new Track(new BezierPath([this.plane.position, this.config.to]), 0.05);
  };

  step = () => {
    if (this.taxiPath.progress < 1) {
      this.plane.z = 0;
      this.plane.track = this.taxiPath;
    } else {
      this.plane.track = null;
      // item.action = null;
      this.finished = true;
    }
  };
}
