import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const COLORS = ['#4F46E5', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

export default function Reporting() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simplified query: only fetching equipment table data
      const { data, error: equipError } = await supabase.from('equipment').select('*');
      if (equipError) throw equipError;
      setEquipment(data || []);
    } catch (err: any) {
      console.error('Error loading equipment', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return equipment;
    return equipment.filter((e) => {
      const name = ((e.name || e.full_name) + '').toLowerCase();
      const category = ((e.category || e.type) + '').toLowerCase();
      return name.includes(q) || category.includes(q);
    });
  }, [equipment, query]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((e) => {
      const cat = (e.category || e.type || 'Uncategorized') + '';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const colorFor = (key: string) => {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h << 5) - h + key.charCodeAt(i);
    const idx = Math.abs(h) % COLORS.length;
    return COLORS[idx];
  };

  const groups = useMemo(() => {
    const m = new Map<string, any[]>();
    filtered.forEach((e) => {
      const cat = (e.category || e.type || 'Uncategorized') + '';
      if (!m.has(cat)) m.set(cat, []);
      m.get(cat)!.push(e);
    });
    const arr = Array.from(m.entries()).map(([k, v]) => [k, v.sort((a: any, b: any) => ('' + (a.name || '')).localeCompare(b.name || ''))]);
    return arr as [string, any[]][];
  }, [filtered]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reporting</h1>
          <p className="text-sm text-muted-foreground">Equipment reports and visualizations.</p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search equipment or category"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72"
          />
          <Button onClick={() => loadEquipment()} variant="ghost">Refresh</Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-destructive">Error loading equipment: {error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <h3 className="text-lg font-semibold mb-3">Overall Equipment Effectiveness</h3>
          {loading ? (
            <div>Loading...</div>
          ) : groups.length === 0 ? (
            <div className="text-sm text-muted-foreground">No data to render chart.</div>
          ) : (
            <div style={{ width: '100%', height: 360 }}>
              <svg width="100%" height={360} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid meet">
                {['Fully Productive Time', 'Material Availability', 'Equipment Failure'].map((lbl, i) => (
                  <text key={lbl} x={120 + i * 240} y={340} fontSize={12} fill="#9CA3AF" textAnchor="middle">{lbl}</text>
                ))}
                {groups.slice(0, 6).map(([cat, items], gi) => {
                  const avgHealth = Math.max(0, Math.min(100, (items.reduce((s: number, it: any) => s + (Number(it.health_percentage ?? it.health ?? 0) || 0), 0) / Math.max(1, items.length))));
                  const x0 = 120; const x1 = 360; const x2 = 600;
                  const v0 = Math.min(100, avgHealth * 1.1);
                  const v1 = Math.min(100, avgHealth * 0.75);
                  const v2 = Math.min(100, avgHealth * 0.35);
                  const scaleY = (val: number) => 300 - (val / 100) * 260;
                  const path = `M ${x0} ${scaleY(v0)} L ${x1} ${scaleY(v1)} L ${x2} ${scaleY(v2)} L ${x2} 320 L ${x0} 320 Z`;
                  const color = COLORS[gi % COLORS.length];
                  return (
                    <g key={cat}>
                      <path d={path} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={2} />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <h3 className="text-lg font-semibold mb-3">Top Categories — Vertical Bars</h3>
          {loading ? (
            <div>Loading...</div>
          ) : categoryCounts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No category data.</div>
          ) : (
            <div style={{ width: '100%', height: 360 }}>
              <svg width="100%" height={360} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid meet">
                {categoryCounts.slice(0, 3).map((cat, ci) => {
                  const x = 120 + ci * 240;
                  const items = groups.find(([k]) => k === cat.name)?.[1] || [];
                  const maxHeight = 260;
                  let yAcc = 320;
                  return (
                    <g key={cat.name}>
                      <text x={x} y={340} fontSize={12} textAnchor="middle" fill="#9CA3AF">{cat.name}</text>
                      {items.map((it: any, i: number) => {
                        const h = Math.max(6, (1 / Math.max(1, items.length)) * maxHeight);
                        const y = yAcc - h;
                        const color = colorFor(it.name || it.id || String(i));
                        yAcc = y;
                        return <rect key={it.id || i} x={x - 60} y={y} width={120} height={h} fill={color} stroke="#111827" strokeWidth={1} />;
                      })}
                      <text x={x} y={yAcc - 8} fontSize={14} textAnchor="middle" fill="#111827">{cat.value}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Equipment ({filtered.length})</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => {
            const name = e.name || e.full_name || 'Unnamed Equipment';
            const category = e.category || e.type || 'Uncategorized';
            const status = e.status || e.state || 'Unknown';
            const location = e.location || e.company || '—';
            const health = Math.max(0, Math.min(100, Number(e.health_percentage ?? e.health ?? 0)));
            const color = colorFor(name + (e.id || ''));

            return (
              <div key={e.id || name} className="bg-card rounded-lg border border-border p-4 shadow-card hover:shadow-md transition-shadow flex gap-4 items-start">
                <div className="w-1.5 rounded-full mt-1" style={{ background: color }} />

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{category}</div>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color }}>{status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{location}</div>
                    </div>
                  </div>

                  {/* Technician section removed from here */}
                  <div className="mt-3">
                    <div className="w-full">
                      <div className="text-xs text-muted-foreground mb-1">Health</div>
                      <div className="w-full bg-muted/20 rounded h-2 overflow-hidden">
                        <div className="h-2 rounded" style={{ width: `${health}%`, background: color }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{health}%</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}