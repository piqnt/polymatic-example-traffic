/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Task } from "../Timeline";

export interface DelayConfig {
  type: "delay";
  time: number;
}

export class DelayTask implements Task {
  name = "delay";
  time: number;

  started: boolean;
  finished: boolean;
  plane: Plane;
  config: DelayConfig;

  constructor(plane: Plane, config: DelayConfig) {
    this.plane = plane;
    this.config = config;
  }

  start = () => {
    this.time = this.config.time;
  };

  step = (dt: number) => {
    this.plane.z = 0;
    this.time -= dt;
    if (this.time <= 0) {
      // item.action = null;
      this.finished = true;
    }
  };
}
