import { useState, useEffect, useCallback } from 'react';
import { api, DashboardStats, Project, Activity, User } from '@/lib/mock-api';

interface UseAsyncDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useDashboardStats(): UseAsyncDataResult<DashboardStats> {
  return useAsyncData(() => api.getDashboardStats(), []);
}

export function useProjects(): UseAsyncDataResult<Project[]> {
  return useAsyncData(() => api.getProjects(), []);
}

export function useProject(id: string): UseAsyncDataResult<Project | null> {
  return useAsyncData(() => api.getProjectById(id), [id]);
}

export function useRecentActivities(): UseAsyncDataResult<Activity[]> {
  return useAsyncData(() => api.getRecentActivities(), []);
}

export function useUsers(): UseAsyncDataResult<User[]> {
  return useAsyncData(() => api.getUsers(), []);
}

export function useCurrentUser(): UseAsyncDataResult<User> {
  return useAsyncData(() => api.getCurrentUser(), []);
}
