
import React from 'react';
import { Collaborator, DeliveryStatus } from '../types';
import { FileCheck, Image as ImageIcon } from 'lucide-react';

interface Props {
  collaborators: Collaborator[];
  onDeliver: (collab: Collaborator) => void;
}

const CollaboratorList: React.FC<Props> = ({ collaborators, onDeliver }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 border-b">Cédula</th>
            <th className="px-6 py-4 border-b">Nombre</th>
            <th className="px-6 py-4 border-b">Estado</th>
            <th className="px-6 py-4 border-b text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {collaborators.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium">
                No hay resultados para mostrar.
              </td>
            </tr>
          ) : (
            collaborators.map((collab) => (
              <tr key={collab.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-slate-600">{collab.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{collab.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    collab.status === DeliveryStatus.DELIVERED 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {collab.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex justify-end items-center gap-4">
                    {collab.status === DeliveryStatus.PENDING ? (
                      <button 
                        type="button"
                        onClick={() => onDeliver(collab)}
                        className="inline-flex items-center gap-2 bg-[#E20613] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-sm active:scale-95"
                      >
                        <FileCheck className="w-4 h-4" />
                        Entregar
                      </button>
                    ) : (
                      <div className="inline-flex items-center text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                        <ImageIcon className="w-3.5 h-3.5 mr-1" />
                        Cargado
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CollaboratorList;
