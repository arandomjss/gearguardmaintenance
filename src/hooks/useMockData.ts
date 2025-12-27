import { useState, useEffect, useCallback } from 'react';
import { api, DashboardStats, Project, Activity, User } from '@/lib/mock-api';
import { supabase } from '@/lib/supabase';

export type MaintenanceRequest = {
  id: number;
  subject: string;
  description?: string;
  created_by?: string | null;
  technician_id?: string | null;
  schedule_date?: string | null;
  duration_hours?: number | null;
  maintenance_for?: string | null;
  equipment_id?: number | null;
  work_center_id?: number | null;
  priority?: string | null;
  request_type?: string | null;
  stage?: string | null;
  created_at?: string | null;
  // enriched fields
  equipment_name?: string | null;
  equipment_category?: string | null;
  creator_name?: string | null;
  technician_name?: string | null;
};

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

// Supabase-backed maintenance requests hook
export function useMaintenanceRequests(): UseAsyncDataResult<MaintenanceRequest[]> {
  return useAsyncData(async () => {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // supabase returns `any[]`, cast to our type
    const requests = (data as unknown) as MaintenanceRequest[];

    // collect equipment ids and profile ids to enrich
    const equipmentIds = Array.from(new Set(requests.map(r => r.equipment_id).filter(Boolean) as number[]));
    const profileIds = Array.from(new Set(requests.flatMap(r => [r.created_by, r.technician_id]).filter(Boolean) as string[]));

    // DEBUG: log fetched ids to help diagnose missing names
    // eslint-disable-next-line no-console
    console.debug('useMaintenanceRequests: sample requests', requests.slice(0, 10).map(r => ({ id: r.id, technician_id: r.technician_id, created_by: r.created_by })));
    // eslint-disable-next-line no-console
    console.debug('useMaintenanceRequests: profileIds', profileIds);

    const equipmentMap: Record<number, { name?: string; category?: string }> = {};
    if (equipmentIds.length) {
      const { data: eqData } = await supabase.from('equipment').select('id,name,category').in('id', equipmentIds);
      (eqData || []).forEach((e: any) => {
        equipmentMap[e.id] = { name: e.name, category: e.category };
      });
    }

    const profileMap: Record<string, { full_name?: string }> = {};
    if (profileIds.length) {
      const { data: prData } = await supabase.from('profiles').select('id,full_name').in('id', profileIds);
      (prData || []).forEach((p: any) => {
        profileMap[p.id] = { full_name: p.full_name };
      });
      // eslint-disable-next-line no-console
      console.debug('useMaintenanceRequests: profileMap keys', Object.keys(profileMap));
    }

    const mapped = requests.map(r => ({
      ...r,
      equipment_name: r.equipment_id ? equipmentMap[r.equipment_id]?.name ?? null : null,
      equipment_category: r.equipment_id ? equipmentMap[r.equipment_id]?.category ?? null : null,
      creator_name: r.created_by ? profileMap[r.created_by]?.full_name ?? null : null,
      technician_name: r.technician_id ? profileMap[r.technician_id]?.full_name ?? null : null,
    }));

    // eslint-disable-next-line no-console
    console.debug('useMaintenanceRequests: mapped sample', mapped.slice(0, 10).map(m => ({ id: m.id, technician_name: m.technician_name })));

    return mapped;
  }, []);
}
