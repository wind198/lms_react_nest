import dayjs, { ConfigType } from "dayjs";
import { parse } from "qs";
import { IOrder, ISearchParamObj, IStringOrNumber } from "../types/common.type";
import { SortOrder } from "antd/es/table/interface";

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
