import dayjs, { ConfigType } from "dayjs";
import { parse } from "qs";
import { IOrder, ISearchParamObj, IStringOrNumber } from "../types/common.type";
import { SortOrder } from "antd/es/table/interface";
import { groupBy, last } from "lodash-es";
import { IRoomOpenTime } from "@/lib/types/entities/room-open-time.entity";

/**
 * HELPERS
 */

export const apiPrefix = (i: string) => {
  const input = i.replace(/^\//, "");
  if (input.startsWith("api")) {
    return input;
  }
  return ["api", input].join("/");
};

export const getOneUrl = (resourcePlural: string, id: IStringOrNumber) => {
  return [resourcePlural.replace(/\/$/, ""), id].join("/");
};
export const getRepresentationUrl = (
  resourcePlural: string,
  id: IStringOrNumber
) => {
  return [resourcePlural.replace(/\/$/, ""), id, "representation"].join("/");
};
export const getManyUrl = (resourcePlural: string) => {
  return [resourcePlural.replace(/\/$/, ""), "get-many"].join("/");
};
export const updateManyUrl = (resourcePlural: string) => {
  return [resourcePlural.replace(/\/$/, ""), "update-many"].join("/");
};
export const deleteManyUrl = (resourcePlural: string) => {
  return [resourcePlural.replace(/\/$/, ""), "delete-many"].join("/");
};

export const reserveOrder = (i: IOrder) => (i === "asc" ? "desc" : "asc");

export const joinStr = (...i: string[]) => i.join(" ");

export const getAge = (i: ConfigType) => dayjs().diff(i, "year");

export const extractQueryString = (fullPath: string) => {
  // Find the position of the "?" in the fullPath
  const queryIndex = fullPath.indexOf("?");

  // If there's no query string, return an empty string
  if (queryIndex === -1) return "";

  // Extract the query string without the "?"
  return fullPath.slice(queryIndex + 1);
};

export const parseQueryStringToSearchParamObject = (
  queryString: string
): ISearchParamObj => {
  // Remove leading "?" if it exists
  const cleanQueryString = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;

  // Split the query string into key-value pairs

  return parse(decodeURI(cleanQueryString));
};

export function removeNullFields(obj: any) {
  if (typeof obj !== "object" || obj === null) return obj; // Base case for non-object types or null

  for (const key in obj) {
    if (obj[key] === null) {
      delete obj[key]; // Remove null field
    } else if (typeof obj[key] === "object") {
      obj[key] = removeNullFields(obj[key]); // Recursive call for nested objects or arrays

      // If an object becomes empty after removing null fields, delete it
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }

  return obj;
}

export const getDeleteApi = (resource: string) =>
  apiPrefix(`/${resource}/destroy-many`);

export const getPathSegments = (i: string) => i.split(/\/+/).filter(Boolean);
export const removeTrailingSlash = (i: string) => i.replace(/\/+$/g, "");

export const onClickToTargetInnerLink = (target: HTMLElement) => {
  target.querySelector("a")?.click();
};

export const isNullOrUndefined = (v: any) => v === null || v === undefined;

export const reverseAntdSortOrder = (
  i: SortOrder | undefined
): SortOrder | undefined => {
  if (!i) {
    return i;
  }
  if (i === "ascend") {
    return "descend";
  }
  return "ascend";
};
export const reverseOrder = (i: IOrder | undefined): IOrder | undefined => {
  if (!i) {
    return i;
  }
  if (i === "asc") {
    return "desc";
  }
  return "asc";
};

// i in format HH:mm
export const countMinuteFromHourString = (i: string) => {
  if (!i.match(/\d{2}:\d{2}/)) {
    throw "Invalid hour string";
  }
  const [hour, minute] = i.split(":").map((i) => parseInt(i));
  return hour * 60 + minute;
};

export const isConsecutiveSequence = (input: number[]) => {
  if (!input?.length) {
    throw "Invalid sequence length";
  }
  if (input.length <= 1) {
    return true;
  }
  for (let k = 0; k < input.length - 1; k++) {
    const element = input[k];
    const nextElement = input[k + 1];
    if (nextElement !== element + 1) {
      return false;
    }
  }
  return true;
};

export const WeekdayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const renderHourStringFromMinuteCount = (
  minuteCount: number
): string => {
  const hour = Math.floor(minuteCount / 60);
  const minute = minuteCount % 60;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

export const formatOpenTimes = (openTimes: IRoomOpenTime[]) => {
  if (!openTimes?.length) {
    return [];
  }
  const formatedOpenTimes = openTimes.map(
    ({ week_days, start_time, end_time }) => {
      if (isConsecutiveSequence(week_days)) {
        return {
          week_days_label: [
            WeekdayList[week_days[0]],
            WeekdayList[last(week_days)!],
          ].join(" → "),
          time: [start_time, end_time]
            .map((i) => renderHourStringFromMinuteCount(i))
            .join(" → "),
        };
      }
      return {
        week_days_label: week_days
          .map((weekday) => WeekdayList[weekday])
          .join(", "),
        time: `${start_time} to ${end_time}`,
      };
    }
  );
  return Object.entries(
    groupBy(formatedOpenTimes, (i) => i.week_days_label)
  ).map(([k, v]) => ({
    week_days_label: k,
    time: v.map((i) => i.time),
  }));
};
