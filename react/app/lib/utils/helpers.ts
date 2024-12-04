import { AxiosHeaders } from "axios";
import { IFilter, IOrder, IStringOrNumber } from "../types/common.type";
import dayjs, { ConfigType } from "dayjs";
import { LocationQuery } from "vue-router";

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
  return [apiPrefix(resourcePlural).replace(/\/$/, ""), id].join("/");
};
export const getRepresentationUrl = (
  resourcePlural: string,
  id: IStringOrNumber
) => {
  return [
    apiPrefix(resourcePlural).replace(/\/$/, ""),
    id,
    "representation",
  ].join("/");
};
export const getManyUrl = (resourcePlural: string) => {
  return [apiPrefix(resourcePlural).replace(/\/$/, ""), "get-many"].join("/");
};
export const updateManyUrl = (resourcePlural: string) => {
  return [apiPrefix(resourcePlural).replace(/\/$/, ""), "update-many"].join(
    "/"
  );
};
export const deleteManyUrl = (resourcePlural: string) => {
  return [apiPrefix(resourcePlural).replace(/\/$/, ""), "delete-many"].join(
    "/"
  );
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

export const parseQueryStringToLocationQuery = (
  queryString: string
): LocationQuery => {
  const query: LocationQuery = {};

  // Remove leading "?" if it exists
  const cleanQueryString = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString;

  // Split the query string into key-value pairs
  const pairs = cleanQueryString.split("&");

  pairs.forEach((pair) => {
    const [key, value] = pair.split("=").map(encodeURI);

    if (key) {
      // Handle multiple values for the same key
      if (query[key]) {
        // If the key already exists, convert it to an array (if not already)
        query[key] = Array.isArray(query[key])
          ? [...query[key], value]
          : [query[key], value];
      } else {
        // Add key-value pair to the query object
        query[key] = value;
      }
    }
  });

  return query;
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
