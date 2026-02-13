/*
 * Copyright (c) Ali Shakiba
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type Point = { x: number; y: number };

export interface Path {
  locate: (t: number, result: Point) => Point;
}

/**
 * Tracks an object along a path with a given speed.
 *
 * The track can be stepped forward in time, and it will update its position and angle accordingly.
 */
export class Track {
  path: Path;
  speed: number;

  point = { x: 0, y: 0 };
  angle = 0;
  progress = 0;

  constructor(path: Path, speed: number) {
    this.path = path;
    this.speed = speed;
  }

  step = (dt: number) => {
    this.goto(this.progress, dt);
  };

  goto = (progress: number, dt: number = 0) => {
    const delta = { x: 0, y: 0 };
    epsilonVelocity(delta, this.path, this.progress, 0.01);
    const stretch = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    this.progress = progress + (dt * this.speed) / stretch;
    this.angle = Math.atan2(delta.y, delta.x);
    this.path.locate(this.progress, this.point);
  };
}

/**
 * Provide 2-4 points for linear, quadratic, or cubic path.
 */
export class BezierPath implements Path {
  points: Point[];

  constructor(points: Point[]) {
    if (!points || !points.length) {
      throw new Error("Invalid points");
    }

    // make a copy
    this.points = points.map((point) => ({ x: point.x, y: point.y }));
  }

  locate = (p: number, out = { x: 0, y: 0 }) => {
    const ip = 1 - p;
    if (this.points.length === 4) {
      out.x =
        ip * ip * ip * this.points[0].x +
        3 * ip * ip * p * this.points[1].x +
        3 * ip * p * p * this.points[2].x +
        p * p * p * this.points[3].x;
      out.y =
        ip * ip * ip * this.points[0].y +
        3 * ip * ip * p * this.points[1].y +
        3 * ip * p * p * this.points[2].y +
        p * p * p * this.points[3].y;
    } else if (this.points.length === 3) {
      out.x = ip * ip * this.points[0].x + 2 * ip * p * this.points[1].x + p * p * this.points[2].x;
      out.y = ip * ip * this.points[0].y + 2 * ip * p * this.points[1].y + p * p * this.points[2].y;
    } else if (this.points.length === 2) {
      out.x = ip * this.points[0].x + p * this.points[1].x;
      out.y = ip * this.points[0].y + p * this.points[1].y;
    } else if (this.points.length === 1) {
      out.x = this.points[0].x;
      out.y = this.points[0].y;
    }
    return out;
  };
}

/** Approximates the velocity of a path at a given point by using a small epsilon. */
const epsilonVelocity = (out: Point, path: Path, p: number, e = 0.001) => {
  const location = { x: 0, y: 0 };
  path.locate(p, location);
  const x1 = location.x;
  const y1 = location.y;

  path.locate(p + e, location);
  const x2 = location.x;
  const y2 = location.y;

  out.x = (x2 - x1) / e;
  out.y = (y2 - y1) / e;
};
