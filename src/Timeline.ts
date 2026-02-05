// Copyright (c) Ali Shakiba
// Licensed under the MIT License

const DEBUG = false;

export interface Task {
  name: string;
  started: boolean;
  finished: boolean;
  start(): any;
  step(dt: number): any;
}

export interface TimelineContext {
  timeline: Task[];
}

export const clearTimeline = (context: { timeline: Task[] }) => {
  context.timeline.length = 0;
};

export const stepTimeline = (context: { timeline: Task[] }, dt: number) => {
  const timeline = context.timeline;
  if (!timeline.length) return false;
  let head = timeline[0];
  if (head.finished) {
    DEBUG && console.log("already finished", head.name);
    timeline.shift();
    head = timeline[0];
  }
  if (!head) return false;

  if (!head.started) {
    DEBUG && logTimeline(context.timeline, "start");
    head.started = true;
    head.start();
  }

  head.step(dt);

  if (head.finished) {
    const index = timeline.indexOf(head);
    timeline.splice(index, 1);
    // timeline.shift();
    DEBUG && logTimeline(context.timeline, "finish");
  }
};

export const runTask = (context: { timeline: Task[] }, list: Task[]) => {
  context.timeline.unshift(...list);
};

let t = performance.now();
const logTimeline = (timeline: Task[], name: string) => {
  console.log("timeline", (performance.now() - t) | 0, name, "[" + timeline.map((e) => e).join(", ") + "]");
  t = performance.now();
};
