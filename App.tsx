
import React, { useState, useMemo, useEffect } from 'react';
import { Collaborator, DeliveryStatus, Stats } from './types';
import { INITIAL_COLLABORATORS } from './data';
import CollaboratorList from './components/CollaboratorList';
import DeliveryModal from './components/DeliveryModal';
import DashboardStats from './components/DashboardStats';
import { Search, RotateCcw, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const App: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const saved = localStorage.getItem('g4s_delivery_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filtramos por si acaso quedó rastro de la persona eliminada en cache
        return parsed.filter((c: Collaborator) => c.id !== '1026555496');
      } catch (e) {
        return INITIAL_COLLABORATORS;
      }
    }
    return INITIAL_COLLABORATORS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollab, setSelectedCollab] = useState<Collaborator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const SECURITY_KEY = '1093781185';

  // Persistencia automática en cada cambio de la lista
  useEffect(() => {
    localStorage.setItem('g4s_delivery_data', JSON.stringify(collaborators));
  }, [collaborators]);

  const stats: Stats = useMemo(() => {
    return {
      total: collaborators.length,
      pending: collaborators.filter(c => c.status === DeliveryStatus.PENDING).length,
      delivered: collaborators.filter(c => c.status === DeliveryStatus.DELIVERED).length,
    };
  }, [collaborators]);

  const filteredCollaborators = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return collaborators;
    return collaborators.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.id.includes(query)
    );
  }, [collaborators, searchQuery]);

  const handleOpenDelivery = (collab: Collaborator) => {
    setSelectedCollab(collab);
    setIsModalOpen(true);
  };

  const handleResetData = () => {
    const pass = prompt('ACCESO G4S - REINICIAR LISTA COMPLETA:');
    if (pass === SECURITY_KEY) {
      if (confirm('¿Desea restaurar la lista a su estado inicial? Se borrarán todas las entregas.')) {
        setCollaborators(INITIAL_COLLABORATORS);
      }
    } else if (pass !== null) {
      alert('Clave incorrecta.');
    }
  };

  const handleExportExcel = () => {
    const dataToExport = collaborators.map(c => ({
      'Cédula': c.id,
      'Nombre': c.name,
      'Estado': c.status,
      'Serial Auricular': c.serialNumber || 'No Registrado',
      'Fecha Entrega': c.deliveryDate ? new Date(c.deliveryDate).toLocaleString('es-CO') : '-',
      'Evidencias': c.photoCollaborator && c.photoActa ? 'Cargadas' : 'Incompletas'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entregas");
    
    const wscols = [{wch: 15}, {wch: 40}, {wch: 12}, {wch: 20}, {wch: 25}, {wch: 15}];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `G4S_Entregas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDeliveryComplete = (id: string, serial: string, photo1: string, photo2: string) => {
    setCollaborators(prev => prev.map(c => 
      c.id === id ? {
        ...c,
        status: DeliveryStatus.DELIVERED,
        serialNumber: serial,
        photoCollaborator: photo1,
        photoActa: photo2,
        deliveryDate: new Date().toISOString()
      } : c
    ));
    setIsModalOpen(false);
    setSelectedCollab(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#E20613] text-white font-bold px-3 py-1 rounded italic text-xl shadow-md select-none">G4S</div>
            <div className="hidden sm:block text-slate-400 text-[9px] font-black border-l pl-3 ml-1 border-slate-200 tracking-[0.2em] uppercase">
              Security Systems
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Filtrar por nombre o CC..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm focus:bg-white focus:border-[#E20613] outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center border-l border-slate-200 pl-3 gap-2">
              <button 
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden md:inline">Excel</span>
              </button>

              <button 
                onClick={handleResetData}
                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Resetear lista"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <DashboardStats stats={stats} />
        
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <CollaboratorList 
            collaborators={filteredCollaborators} 
            onDeliver={handleOpenDelivery} 
          />
        </div>
      </main>

      {selectedCollab && (
        <DeliveryModal 
          isOpen={isModalOpen}
          collaborator={selectedCollab}
          onClose={() => setIsModalOpen(false)}
          onComplete={handleDeliveryComplete}
        />
      )}
    </div>
  );
};

export default App;
