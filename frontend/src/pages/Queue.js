import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Clock, User, ChevronRight, Activity, Heart, Thermometer, Scale, Ruler } from 'lucide-react';
import { formatTime, calculateBMI, getBMICategory } from '../utils/helpers';

const Queue = () => {
  const { patients, updatePatient } = useData();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  const nowSeeing = patients.find(p => p.status === 'In Consultation');
  const waiting = patients.filter(p => p.status === 'Waiting');

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleMarkCompleted = () => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, { status: 'Completed' });
      setSelectedPatient(null);
    }
  };

  const handleMarkReferred = () => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, { status: 'Referred' });
      setSelectedPatient(null);
    }
  };

  const handleProcedureBill = () => {
    navigate('/procedure-bill', { state: { patient: selectedPatient } });
  };

  const handlePharmacyBill = () => {
    navigate('/pharmacy-bill', { state: { patient: selectedPatient } });
  };

  if (selectedPatient) {
    const bmi = calculateBMI(selectedPatient.vitals?.weight, selectedPatient.vitals?.height);
    const bmiCategory = getBMICategory(bmi);

    return (
      <div className="p-4 space-y-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-[#2563EB] dark:text-[#3B82F6] font-medium flex items-center gap-1 hover:underline"
          >
            ← Back to Queue
          </button>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            selectedPatient.status === 'In Consultation'
              ? 'bg-[#DCFCE7] text-[#16A34A] dark:bg-[#16A34A]/20'
              : selectedPatient.status === 'Waiting'
              ? 'bg-[#FEF3C7] text-[#F59E0B] dark:bg-[#F59E0B]/20'
              : selectedPatient.status === 'Completed'
              ? 'bg-[#DBEAFE] text-[#2563EB] dark:bg-[#2563EB]/20'
              : 'bg-[#FEE2E2] text-[#EF4444] dark:bg-[#EF4444]/20'
          }`}>
            {selectedPatient.status}
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-lg border border-[#E5E7EB] dark:border-[#1E293B] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">
                {selectedPatient.fullName}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-[#6B7280] dark:text-[#94A3B8]">
                <span>{selectedPatient.age} yrs</span>
                <span>·</span>
                <span>{selectedPatient.gender}</span>
                <span>·</span>
                <span>{selectedPatient.mobile}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#2563EB] dark:text-[#3B82F6]">
                {selectedPatient.id}
              </div>
              <div className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-1">
                {selectedPatient.campPlace}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB] dark:border-[#1E293B]">
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Category</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{selectedPatient.patientCategory}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Reference</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{selectedPatient.reference}</p>
            </div>
          </div>
        </div>

        {/* Vitals Card */}
        {selectedPatient.vitals && (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-lg border border-[#E5E7EB] dark:border-[#1E293B] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Vitals</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedPatient.vitals.height && (
                <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4 text-[#2563EB]" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Height</p>
                  </div>
                  <p className="text-xl font-bold text-[#0F172A] dark:text-white">{selectedPatient.vitals.height} cm</p>
                </div>
              )}
              
              {selectedPatient.vitals.weight && (
                <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-[#2563EB]" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Weight</p>
                  </div>
                  <p className="text-xl font-bold text-[#0F172A] dark:text-white">{selectedPatient.vitals.weight} kg</p>
                </div>
              )}
              
              {bmi && (
                <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#2563EB]" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">BMI</p>
                  </div>
                  <p className="text-xl font-bold text-[#0F172A] dark:text-white">{bmi}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-1">{bmiCategory}</p>
                </div>
              )}
              
              {selectedPatient.vitals.bp && (
                <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-[#EF4444]" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">BP</p>
                  </div>
                  <p className="text-xl font-bold text-[#0F172A] dark:text-white">{selectedPatient.vitals.bp}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-1">mmHg</p>
                </div>
              )}
              
              {selectedPatient.vitals.pulse && (
                <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#F59E0B]" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Pulse</p>
                  </div>
                  <p className="text-xl font-bold text-[#0F172A] dark:text-white">{selectedPatient.vitals.pulse}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-1">bpm</p>
                </div>
              )}
              
              {selectedPatient.vitals.temperature && (
                <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-[#EF4444]" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Temp</p>
                  </div>
                  <p className="text-xl font-bold text-[#0F172A] dark:text-white">{selectedPatient.vitals.temperature}°F</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diagnostics Card */}
        {selectedPatient.diagnostics && (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-lg border border-[#E5E7EB] dark:border-[#1E293B] p-6">
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-3">Diagnostics</h3>
            <p className="text-sm text-[#0F172A] dark:text-white leading-relaxed">
              {selectedPatient.diagnostics}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="fixed bottom-20 left-0 right-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-lg border-t border-[#E5E7EB] dark:border-[#1E293B] p-4">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleMarkCompleted}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
              >
                Mark Completed
              </button>
              <button
                onClick={handleMarkReferred}
                className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
              >
                Mark Referred
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleProcedureBill}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
              >
                Procedure Bill
              </button>
              <button
                onClick={handlePharmacyBill}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
              >
                Pharmacy Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white">Queue</h2>
        <div className="px-4 py-2 rounded-full bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#F59E0B] dark:text-[#FCD34D] font-bold text-sm">
          Waiting: {waiting.length}
        </div>
      </div>

      {/* Now Seeing */}
      {nowSeeing && (
        <div>
          <h3 className="text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] mb-3 px-1">NOW SEEING</h3>
          <div
            onClick={() => handlePatientClick(nowSeeing)}
            className="bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] dark:from-[#16A34A]/20 dark:to-[#15803D]/20 rounded-2xl shadow-lg border-2 border-[#16A34A] dark:border-[#22C55E] p-6 cursor-pointer hover:shadow-xl transition-all active:scale-98"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-3xl font-bold text-[#16A34A] dark:text-[#22C55E] mb-2">
                  {nowSeeing.id}
                </div>
                <h4 className="text-xl font-bold text-[#0F172A] dark:text-white mb-1">
                  {nowSeeing.fullName}
                </h4>
                <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
                  {nowSeeing.age} yrs · {nowSeeing.gender} · {nowSeeing.campPlace}
                </p>
                {nowSeeing.vitals && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {nowSeeing.vitals.height && (
                      <span className="px-2 py-1 bg-white/50 dark:bg-[#0F172A]/50 rounded-lg text-xs font-medium text-[#0F172A] dark:text-white">
                        Ht: {nowSeeing.vitals.height}cm
                      </span>
                    )}
                    {nowSeeing.vitals.weight && (
                      <span className="px-2 py-1 bg-white/50 dark:bg-[#0F172A]/50 rounded-lg text-xs font-medium text-[#0F172A] dark:text-white">
                        Wt: {nowSeeing.vitals.weight}kg
                      </span>
                    )}
                    {nowSeeing.vitals.bp && (
                      <span className="px-2 py-1 bg-white/50 dark:bg-[#0F172A]/50 rounded-lg text-xs font-medium text-[#0F172A] dark:text-white">
                        BP: {nowSeeing.vitals.bp}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="px-4 py-2 rounded-full bg-[#16A34A] text-white font-bold text-xs">
                In Consultation
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waiting List */}
      {waiting.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] mb-3 px-1">WAITING</h3>
          <div className="space-y-3">
            {waiting.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handlePatientClick(patient)}
                className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-5 cursor-pointer hover:shadow-lg hover:border-[#2563EB] dark:hover:border-[#3B82F6] transition-all active:scale-98 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-[#2563EB] dark:text-[#3B82F6]">
                        {patient.id}
                      </span>
                      <span className="text-base font-semibold text-[#0F172A] dark:text-white">
                        {patient.fullName}
                      </span>
                    </div>
                    <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
                      {patient.age} yrs · {patient.gender} · {formatTime(patient.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#F59E0B] dark:text-[#FCD34D] font-medium text-xs">
                      Waiting
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6B7280] dark:text-[#94A3B8] group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {waiting.length === 0 && !nowSeeing && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-[#E5E7EB] dark:text-[#1E293B] mx-auto mb-4" />
          <p className="text-lg text-[#6B7280] dark:text-[#94A3B8]">No patients in queue</p>
        </div>
      )}
    </div>
  );
};

export default Queue;
