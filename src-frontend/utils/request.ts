import { createStandaloneToast } from "@chakra-ui/react";
const { toast } = createStandaloneToast();

interface RequestProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  options?: RequestInit;
  payload?: object;
  errorShouldNotifyUI?: boolean;
  onCatchErrorMsg?: string;
  errorDuration?: number;
  signal?: AbortSignal | undefined | null;
}

export interface ApiResponse {
  res: any;
  status: number;
}

export const httpReq = async ({
  url,
  method,
  options,
  payload,
  errorShouldNotifyUI = true,
  onCatchErrorMsg = "",
  errorDuration = 10000,
}: RequestProps): Promise<ApiResponse> => {
  try {
    if (
      payload &&
      (method === "POST" || method === "PUT" || method === "DELETE")
    ) {
      options = {
        ...options,
        headers: {
          ...options?.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };
    }
    const response = await fetch(url, {
      ...options,
      method,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");
      const errorData = isJson ? await response.json() : await response.text();
      const errorMessage =
        errorData.detail || `HTTP error! Status: ${response.status}`;
      throw new Error(errorMessage);
    }
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const data = isJson
      ? await response.clone().json()
      : await response.clone().text();
    const statusCode = response.status;
    return { res: data, status: statusCode };
  } catch (error) {
    if (errorShouldNotifyUI) {
      const errorMessage = onCatchErrorMsg || error?.toString();
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: errorDuration,
        isClosable: true,
      });
    }
    return error as any;
  }
};
