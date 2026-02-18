
import React, { useState, useRef } from 'react';
import { Collaborator } from '../types';
import { X, Camera, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  collaborator: Collaborator;
  onClose: () => void;
  onComplete: (id: string, serial: string, photo1: string, photo2: string) => void;
}

const DeliveryModal: React.FC<Props> = ({ isOpen, collaborator, onClose, onComplete }) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [photoCollab, setPhotoCollab] = useState<string | null>(null);
  const [photoActa, setPhotoActa] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalize = () => {
    if (!serialNumber.trim()) {
      setError('El número de serie es obligatorio.');
      return;
    }
    if (!photoCollab) {
      setError('Debe cargar la foto del colaborador recibiendo.');
      return;
    }
    if (!photoActa) {
      setError('Debe cargar la foto del acta firmada.');
      return;
    }

    onComplete(collaborator.id, serialNumber, photoCollab, photoActa);
    // Reset state for next use
    setSerialNumber('');
    setPhotoCollab(null);
    setPhotoActa(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registrar Entrega de Auricular</h2>
            <p className="text-sm text-slate-500 mt-1">Colaborador: <span className="font-semibold">{collaborator.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Serial Number Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Número de Serial (Auricular Motorola)
            </label>
            <input 
              type="text" 
              placeholder="Ej: SN-2026-XXXXX" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E20613] outline-none transition-all font-mono"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Photo 1: Collab */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                1. Foto del colaborador recibiendo
              </label>
              <div 
                className={`relative group h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden ${
                  photoCollab ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-[#E20613] hover:bg-slate-50'
                }`}
              >
                {photoCollab ? (
                  <>
                    <img src={photoCollab} alt="Collab" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => setPhotoCollab(null)} className="bg-white text-red-600 p-2 rounded-full shadow-lg">
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white shadow-sm rounded-full text-slate-400 group-hover:text-[#E20613] transition-colors">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Click para cargar foto</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e, setPhotoCollab)}
                    />
                  </>
                )}
                {photoCollab && <CheckCircle2 className="absolute top-2 right-2 text-green-500 w-5 h-5 bg-white rounded-full" />}
              </div>
            </div>

            {/* Photo 2: Acta */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                2. Foto del Acta firmada
              </label>
              <div 
                className={`relative group h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden ${
                  photoActa ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-[#E20613] hover:bg-slate-50'
                }`}
              >
                {photoActa ? (
                  <>
                    <img src={photoActa} alt="Acta" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => setPhotoActa(null)} className="bg-white text-red-600 p-2 rounded-full shadow-lg">
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white shadow-sm rounded-full text-slate-400 group-hover:text-[#E20613] transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Click para cargar acta</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e, setPhotoActa)}
                    />
                  </>
                )}
                {photoActa && <CheckCircle2 className="absolute top-2 right-2 text-green-500 w-5 h-5 bg-white rounded-full" />}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 leading-relaxed">
            <p className="font-semibold text-slate-700 mb-1 italic">Condiciones del sistema:</p>
            El estado de entrega solo se activará una vez que se hayan cargado ambas fotos y el número de serial. Los datos se guardan de forma segura para auditoría interna de G4S.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t bg-slate-50 rounded-b-2xl flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleFinalize}
            className={`flex-[2] py-3 text-sm font-semibold text-white rounded-xl transition-all shadow-md ${
              (serialNumber && photoCollab && photoActa) 
              ? 'bg-[#E20613] hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0' 
              : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Completar Entrega
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
