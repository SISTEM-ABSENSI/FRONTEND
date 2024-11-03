/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CONFIGS } from "../configs";

export interface GetTableDataTypes {
  url: string;
  pagination?: boolean | true;
  page?: number | 1;
  size?: number | 10;
  filters?: any;
}

export const getHeaders = () => {
  const token = localStorage.getItem(CONFIGS.localStorageKey) || "";
  return {
    Authorization: `Bearer ${token}`,
  };
};

export class ServiceHttp {
  private baseUrl = CONFIGS.baseUrl;

  private handleError(error: any) {
    console.error("Error:", error);
    if (error.response) {
      console.error(
        "Response Error:",
        error.response.data.errorMessage || error.message
      );
      if (error.response.status === 401) {
        // localStorage.removeItem(CONFIGS.localStorageKey);
        // window.location.pathname = "/"; // Redirect to login page
      }
      throw new Error(error.response.data.errorMessage || error.message);
    } else {
      console.error("Network Error");
      throw new Error("Network Error");
    }
  }

  private async request(config: any) {
    const headers = getHeaders();
    try {
      const result = await axios({ ...config, headers });
      return result.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async get({ path }: { path: string }) {
    return this.request({
      method: "get",
      url: this.baseUrl + path,
    });
  }

  public async post({ path, body }: { path: string; body: any }) {
    return this.request({
      method: "post",
      url: this.baseUrl + path,
      data: body,
    });
  }

  public async patch({ path, body }: { path: string; body: any }) {
    return this.request({
      method: "patch",
      url: this.baseUrl + path,
      data: body,
    });
  }

  public async remove({ path }: { path: string }) {
    return this.request({
      method: "delete",
      url: this.baseUrl + path,
    });
  }

  public async getTableData(params: GetTableDataTypes) {
    const { url, page, size, filters } = params;
    const queryFilter = new URLSearchParams(filters).toString();
    return this.request({
      method: "get",
      url: `${url}?page=${page}&size=${size}&${queryFilter}`,
    });
  }
}
