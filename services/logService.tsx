import axios from 'axios';
import { auth } from './firebase';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_API_PORT = '5050';

const isDirectHost = (host: string) => {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host)
  );
};

const getApiUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');

  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (isDirectHost(host)) return `http://${host}:${DEFAULT_API_PORT}/api`;
  }

  if (Platform.OS === 'android') return `http://10.0.2.2:${DEFAULT_API_PORT}/api`;

  return `http://localhost:${DEFAULT_API_PORT}/api`;
};

const API_URL = getApiUrl();

export interface LogEntry {
  _id?: string;
  firebaseUid?: string;
  activityType: string;
  crop: string;
  description?: string;
  cost?: number;
  quantity?: number;
  date: string;
  createdAt?: string;
}

export const saveLog = async (logData: Omit<LogEntry, 'firebaseUid'>): Promise<LogEntry> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  try {
    const response = await axios.post(`${API_URL}/logs`, {
      firebaseUid: user.uid,
      ...logData,
    });
    return response.data.log;
  } catch (error: any) {
    const backendMessage = error?.response?.data?.error;
    throw new Error(backendMessage || 'Failed to save log');
  }
};

export const getLogs = async (type?: string): Promise<LogEntry[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  try {
    const params = type ? { type } : {};
    const response = await axios.get(`${API_URL}/logs/${user.uid}`, { params });
    return response.data.logs;
  } catch (error: any) {
    console.log('GET LOGS STATUS:', error?.response?.status);
    console.log('GET LOGS URL:', error?.config?.url);
    console.log('GET LOGS DATA:', JSON.stringify(error?.response?.data));
    const backendMessage = error?.response?.data?.error;
    throw new Error(backendMessage || 'Failed to fetch logs');
  }
};

export const deleteLog = async (logId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/logs/${logId}`);
  } catch (error: any) {
    const backendMessage = error?.response?.data?.error;
    throw new Error(backendMessage || 'Failed to delete log');
  }
};