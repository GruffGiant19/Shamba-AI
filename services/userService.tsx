import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { auth } from "./firebase";

const DEFAULT_API_PORT = "5050";

const isDirectHost = (host: string) => {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host)
  );
};

const getApiUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (isDirectHost(host)) {
      return `http://${host}:${DEFAULT_API_PORT}/api`;
    }
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${DEFAULT_API_PORT}/api`;
  }

  return `http://localhost:${DEFAULT_API_PORT}/api`;
};

const API_URL = getApiUrl();

export const saveUserProfile = async (profileData: any) => {
  try {
    const user = auth.currentUser;

    if (!user) throw new Error("No authenticated user");

    const payload = {
      firebaseUid: user.uid,
      email: user.email,
      ...profileData,
    };

    const endpoint = `${API_URL}/users/profile`;
    const response = await axios.post(endpoint, payload);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const endpoint = error?.config?.url || `${API_URL}/users/profile`;
    const backendMessage = error?.response?.data?.error;
    throw new Error(
      backendMessage ||
        `Request failed${status ? ` (status ${status})` : ""} at ${endpoint}`,
    );
  }
};

export const getUserProfile = async () => {
  const user = auth.currentUser;
  try {
    if (!user) throw new Error("No authenticated User");

    const endpoint = `${API_URL}/users/profile/${user.uid}`;
    const response = await axios.get(endpoint);
    return response.data.user;
  } catch (error: any) {
    const status = error?.response?.status;
    const endpoint = error?.config?.url || `${API_URL}/users/profile/${user?.uid || ""}`;
    const backendMessage = error?.response?.data?.error;
    throw new Error(
      backendMessage ||
        `Request failed${status ? ` (status ${status})` : ""} at ${endpoint}`,
    );
  }
};
