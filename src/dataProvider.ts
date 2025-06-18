import { DataProvider } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";

// Create a custom data provider that wraps the simple-rest provider
// to handle specific API requirements
export const createRatchetDataProvider = (apiUrl: string): DataProvider => {
  const baseProvider = dataProvider(apiUrl);

  return {
    ...baseProvider,
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const url = `${apiUrl}/${resource}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the backend's response format: { data: [...], meta: { pagination: ... } }
      return {
        data: result.data || [],
        total: result.meta?.pagination?.total || result.data?.length || 0,
      };
    },
    getOne: async ({ resource, id }) => {
      const url = `${apiUrl}/${resource}/${id}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data || result };
    },
    create: async ({ resource, variables }) => {
      const url = `${apiUrl}/${resource}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data || result };
    },
    update: async ({ resource, id, variables }) => {
      // Use PUT for tasks as per OpenAPI spec, PATCH for others
      const method = resource === "tasks" ? "PUT" : "PATCH";
      
      const url = `${apiUrl}/${resource}/${id}`;
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data || result };
    },
    deleteOne: async ({ resource, id }) => {
      const url = `${apiUrl}/${resource}/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { data: { id } as any };
    },
    custom: async ({ url, method, payload, headers }) => {
      const response = await fetch(url, {
        method: method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { data: result.data || result };
    },
  };
};