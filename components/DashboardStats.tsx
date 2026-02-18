
import React from 'react';
import { Stats } from '../types';
import { Package, CheckCircle, Clock } from 'lucide-react';

interface Props {
  stats: Stats;
}

const DashboardStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Colaboradores</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Entregados</p>
          <p className="text-2xl font-bold text-slate-900">{stats.delivered}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Pendientes</p>
          <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
