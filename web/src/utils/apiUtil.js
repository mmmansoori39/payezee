import { create } from "apisauce";
import camelCase from "lodash/camelCase";
import { mapKeysDeep } from "./mapKeysDeep";
import { BACKEND_BASE_URL } from "./constants";
// import snakeCase from "lodash/snakeCase";

const apiClients = {
  backend: null
};

export const getApiClient = (type = "backend") => apiClients[type];

export const generateApiClient = (type = "backend") => {
  switch (type) {
    case "backend":
      apiClients[type] = createApiClientWithTransForm(BACKEND_BASE_URL);
      return apiClients[type];
    default:
      apiClients.default = createApiClientWithTransForm(BACKEND_BASE_URL);
      return apiClients.default;
  }
};

export const createApiClientWithTransForm = (baseURL) => {
  const api = create({
    baseURL,
    headers: { "Content-Type": "application/json" }
  });

  api.addResponseTransform((response) => {
    const { ok, data, status } = response;
    if (status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    if (ok && data) {
      response.data = mapKeysDeep(data, (keys) => camelCase(keys));
    }
    return response;
  });

  api.addRequestTransform((request) => {
    let token = null;
    try {
      const userData = JSON.parse(localStorage.getItem("user-kosmossolution") || "{}");
      token = userData?.token || null; // Ensure token is safely extracted
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }

    if (token) {
      request.headers["x-auth-token"] = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }

    return request;
  });

  return api;
};

export const apiClient = createApiClientWithTransForm(BACKEND_BASE_URL);