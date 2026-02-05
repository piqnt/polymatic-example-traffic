/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Task } from "../Timeline";
import { type Point } from "../Track";

export interface EnterConfig {
  type: "enter";
  location: Point;
}

export class EnterTask implements Task {
  name = "enter";
  location: Point;

  started: boolean;
  finished: boolean;
  plane: Plane;
  config: EnterConfig;

  constructor(plane: Plane, config: EnterConfig) {
    this.plane = plane;
    this.config = config;
  }

  start = () => {
    this.location = this.config.location;
  };

  step = () => {
    this.plane.position = {
      x: this.location.x,
      y: this.location.y,
    };
    // item.action = null;
    this.finished = true;
  };
}
