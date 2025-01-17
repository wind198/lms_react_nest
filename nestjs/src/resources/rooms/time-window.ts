import { cloneDeep, differenceWith, isEqual } from 'lodash';

export class TimeWindow {
  start: number;
  end: number;
  reference?: moment.MomentInput;
  constructor(start: number, end: number, reference?: moment.MomentInput) {
    if (end <= start) {
      throw new Error(`Invalid time window, start is ${start}, end is ${end}`);
    }
    this.start = start;
    this.end = end;
    this.reference = reference;
  }

  get asArray() {
    return [this.start, this.end];
  }

  get duration() {
    return this.end - this.start;
  }

  static checkTimeWindowOverlap(a: TimeWindow, b: TimeWindow) {
    if (a.start <= b.start) {
      return a.end >= b.start;
    }
    return b.end >= a.start;
  }

  static merge2TimeWindow(a: TimeWindow, b: TimeWindow) {
    if (TimeWindow.checkTimeWindowOverlap(a, b)) {
      return [
        new TimeWindow(Math.min(a.start, b.start), Math.max(a.end, b.end)),
      ];
    }
    return [a, b];
  }

  static mergeMultipleTimeWindow(...items: TimeWindow[]) {
    if (items.length < 2) {
      return cloneDeep(items);
    }
    const output: TimeWindow[] = [];
    items.sort((a, b) => a.start - b.start);
    let index = 0;
    while (index < items.length) {
      const item = items[index];
      if (!output.length) {
        output.push(item);
      } else {
        const last = output.pop();
        output.push(...TimeWindow.merge2TimeWindow(last, item));
      }
      index++;
    }
  }

  static subtract2TimeWindowList(
    $firstList: TimeWindow[],
    $secondList: TimeWindow[],
  ) {
    const firstListAsArr = $firstList.map((i) => i.asArray);
    const secondListAsArr = $secondList.map((i) => i.asArray);

    const firstListFlatten = firstListAsArr.flat();
    const secondListFlatten = secondListAsArr.flat();

    for (let i = 0; i < firstListAsArr.length; i++) {
      const timeWindow = firstListAsArr[i];
      for (let k = 0; k < secondListFlatten.length; k++) {
        const value = secondListFlatten[k];
        if (value > timeWindow[1]) {
          break;
        }
        if (timeWindow[0] < value && value < timeWindow[1]) {
          firstListAsArr.splice(
            i,
            1,
            [timeWindow[0], value],
            [value, timeWindow[1]],
          );
        }
      }
    }
    for (let i = 0; i < secondListAsArr.length; i++) {
      const timeWindow = secondListAsArr[i];
      for (let k = 0; k < firstListFlatten.length; k++) {
        const value = firstListFlatten[k];
        if (value > timeWindow[1]) {
          break;
        }
        if (timeWindow[0] < value && value < timeWindow[1]) {
          secondListAsArr.splice(
            i,
            1,
            [timeWindow[0], value],
            [value, timeWindow[1]],
          );
        }
      }
    }

    return TimeWindow.mergeMultipleTimeWindow(
      ...differenceWith(firstListAsArr, secondListAsArr, (a, b) =>
        isEqual(a, b),
      ).map(([start, end]) => new TimeWindow(start, end)),
    );
  }

  compareWith(other: TimeWindow) {
    if (TimeWindow.checkTimeWindowOverlap(this, other)) {
      return 0;
    }
    if (this.start < other.start) {
      return -1;
    }
    return 1;
  }
}
