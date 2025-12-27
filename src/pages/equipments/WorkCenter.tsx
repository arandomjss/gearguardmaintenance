import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Settings } from "lucide-react";

// Types matching your database schema and UI
interface WorkCenterType {
  id: string;
  name: string;
  code: string;
  tag: string;
  alternative_workcenters: string;
  cost_per_hour: number;
  capacity: number;
  time_efficiency: number;
  oee_target: number;
}

// Mock Data from your screenshot
const MOCK_DATA: WorkCenterType[] = [
  {
    id: 'wc1',
    name: 'Assembly 1',
    code: 'WC001',
    tag: 'Assembly',
    alternative_workcenters: 'Assembly 2',
    cost_per_hour: 45.00,
    capacity: 1.00,
    time_efficiency: 100.00,
    oee_target: 34.59
  },
  {
    id: 'wc2',
    name: 'Drill 1',
    code: 'WC002',
    tag: 'Drilling',
    alternative_workcenters: '',
    cost_per_hour: 30.00,
    capacity: 1.00,
    time_efficiency: 100.00,
    oee_target: 90.00
  }
];

export default function WorkCenter() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-white border rounded-lg shadow-sm min-h-[80vh] flex flex-col">
      {/* Header & Actions */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-500" />
          <h1 className="text-xl font-bold text-gray-800">Work Centers</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> New
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-bold text-gray-700 h-12">Work Center</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Code</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Tag</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Alternative Workcenters</TableHead>
              <TableHead className="font-bold text-gray-700 h-12 text-right">Cost per hour</TableHead>
              <TableHead className="font-bold text-gray-700 h-12 text-right">Capacity</TableHead>
              <TableHead className="font-bold text-gray-700 h-12 text-right">Time Efficiency</TableHead>
              <TableHead className="font-bold text-gray-700 h-12 text-right">OEE Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_DATA.map((row) => (
              <TableRow key={row.id} className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-primary">{row.name}</TableCell>
                <TableCell className="text-gray-600">{row.code || '-'}</TableCell>
                <TableCell className="text-gray-600">{row.tag || '-'}</TableCell>
                <TableCell className="text-gray-600">{row.alternative_workcenters || '-'}</TableCell>
                <TableCell className="text-right tabular-nums">{row.cost_per_hour.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums">{row.capacity.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums">{row.time_efficiency.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums font-semibold">{row.oee_target.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}