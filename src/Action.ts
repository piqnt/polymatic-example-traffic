/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type Plane } from "./Plane";

import { type DelayConfig, DelayTask } from "./action/Delay";
import { type EnterConfig, EnterTask } from "./action/Enter";
import { type HoldConfig, HoldTask } from "./action/Hold";
import { type ArrivalConfig, ArrivalAction } from "./action/Arrival";
import { type DepartureConfig, DepartureTask } from "./action/Departure";
import { type TaxiConfig, TaxiTask } from "./action/Taxi";

export const ActionFactory = {
  "enter": (plane: Plane, config: EnterConfig) => new EnterTask(plane, config),
  "arrival": (plane: Plane, config: ArrivalConfig) => new ArrivalAction(plane, config),
  "departure": (plane: Plane, config: DepartureConfig) => new DepartureTask(plane, config),
  "taxi": (plane: Plane, config: TaxiConfig) => new TaxiTask(plane, config),
  "delay": (plane: Plane, config: DelayConfig) => new DelayTask(plane, config),
  "hold": (plane: Plane, config: HoldConfig) => new HoldTask(plane, config),
};
