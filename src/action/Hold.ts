/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Plane } from "../Plane";
import { type Task } from "../Timeline";

export interface HoldConfig {
  type: "hold";
}

export class HoldTask implements Task {
  name = "hold";

  started: boolean;
  finished: boolean;
  plane: Plane;
  config: HoldConfig;

  constructor(plane: Plane, config: HoldConfig) {
    this.plane = plane;
    this.config = config;
  }

  start = () => {};

  step = () => {
    this.plane.z = 0;
  };

  click = () => {
    // item.action = null;
    this.finished = true;
  };
}
