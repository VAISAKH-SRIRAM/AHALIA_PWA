import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { mockMedicines, mockDoctors } from '../mock';
import { formatCurrency, numberToWords } from '../utils/helpers';
import { Pill, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const PharmacyBilling = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addPharmacyBill } = useData();
  const { toast } = useToast();
  const patient = location.state?.patient;

  const [formData, setFormData] = useState({
    patientId: patient?.id || '',
    patientName: patient?.fullName || '',
    campPlace: patient?.campPlace || '',
    patientGroup: 'General',
    saleType: 'Camp',
    date: new Date().toISOString().split('T')[0],
    doctor: mockDoctors[0].name,
    lines: []
  });

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          medicine: null,
          quantity: 1,
          unitPrice: 0,
          gst: 0,
          lineTotal: 0
        }
      ]
    }));
  };

  const removeLine = (index) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const updateLine = (index, field, value) => {
    setFormData(prev => {
      const newLines = [...prev.lines];
      const line = { ...newLines[index] };

      if (field === 'medicine') {
        const med = mockMedicines.find(m => m.id === parseInt(value));
        if (med) {
          line.medicine = med;
          line.unitPrice = med.price;
          line.gst = med.gst;
        }
      } else {
        line[field] = value;
      }

      // Calculate line total with GST
      const subtotal = line.unitPrice * line.quantity;
      const gstAmount = (subtotal * line.gst) / 100;
      line.lineTotal = subtotal + gstAmount;

      newLines[index] = line;
      return { ...prev, lines: newLines };
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.lines.reduce((sum, line) => sum + (line.unitPrice * line.quantity), 0);
    const gst = formData.lines.reduce((sum, line) => {
      const lineSubtotal = line.unitPrice * line.quantity;
      return sum + (lineSubtotal * line.gst) / 100;
    }, 0);
    const grandTotal = subtotal + gst;
    return { subtotal, gst, grandTotal };
  };

  const handleSave = (print = false) => {
    if (formData.lines.length === 0) {
      toast({
        title: "No medicines added",
        description: "Please add at least one medicine",
        variant: "destructive"
      });
      return;
    }

    const { subtotal, gst, grandTotal } = calculateTotals();
    const bill = {
      ...formData,
      subtotal,
      gst,
      grandTotal,
      status: 'Draft'
    };

    const savedBill = addPharmacyBill(bill);
    
    toast({
      title: "Pharmacy bill saved",
      description: `Bill ${savedBill.id} saved as draft`
    });

    if (print) {
      setTimeout(() => window.print(), 500);
    }

    setTimeout(() => navigate('/queue'), 1000);
  };

  const { subtotal, gst, grandTotal } = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-32">
      <Toaster />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0891B2] to-[#0E7490] dark:from-[#0E7490] dark:to-[#155E75] rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pharmacy Billing</h2>
            <p className="text-[#A5F3FC] dark:text-[#67E8F9] text-sm">
              {patient ? `${patient.id} · ${patient.fullName}` : 'Create new pharmacy bill'}
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-sm">
            DRAFT
          </div>
        </div>
      </div>

      {/* Sale & Patient Info */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-[#0891B2]" />
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Sale Information</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patient && (
            <>
              <div className="sm:col-span-2 bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Patient</p>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{patient.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Camp MR</p>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{patient.id}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Patient Group</label>
            <select
              value={formData.patientGroup}
              onChange={(e) => setFormData(prev => ({ ...prev, patientGroup: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891B2] transition-all"
            >
              <option>General</option>
              <option>BPL</option>
              <option>Insurance</option>
              <option>Senior Citizen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Sale/Bill Type</label>
            <select
              value={formData.saleType}
              onChange={(e) => setFormData(prev => ({ ...prev, saleType: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891B2] transition-all"
            >
              <option>Camp</option>
              <option>Prescription</option>
              <option>OTC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-[#F5F7FB] dark:bg-[#020617] text-[#0F172A] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Doctor</label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891B2] transition-all"
            >
              {mockDoctors.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Medicine Lines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Medicines</h3>
          <button
            onClick={addLine}
            className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] hover:bg-[#0E7490] text-white font-medium rounded-xl transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>

        {formData.lines.map((line, index) => (
          <div key={index} className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-sm font-bold text-[#0891B2]">Line {index + 1}</h4>
              <button
                onClick={() => removeLine(index)}
                className="text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#EF4444]/20 p-2 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Product</label>
                <select
                  value={line.medicine?.id || ''}
                  onChange={(e) => updateLine(index, 'medicine', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891B2] transition-all"
                >
                  <option value="">Select medicine</option>
                  {mockMedicines.map(m => (
                    <option key={m.id} value={m.id}>{m.name} - {formatCurrency(m.price)}</option>
                  ))}
                </select>
              </div>

              {line.medicine && (
                <div className="sm:col-span-2 bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-3">
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-[#6B7280] dark:text-[#94A3B8]">Batch</p>
                      <p className="font-semibold text-[#0F172A] dark:text-white">{line.medicine.batch}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] dark:text-[#94A3B8]">Expiry</p>
                      <p className="font-semibold text-[#0F172A] dark:text-white">{line.medicine.expiry}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] dark:text-[#94A3B8]">Stock</p>
                      <p className="font-semibold text-[#0F172A] dark:text-white">{line.medicine.stock} units</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891B2] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Unit Price</label>
                <input
                  type="number"
                  value={line.unitPrice}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-[#F5F7FB] dark:bg-[#020617] text-[#0F172A] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">GST %</label>
                <input
                  type="number"
                  value={line.gst}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-[#F5F7FB] dark:bg-[#020617] text-[#0F172A] dark:text-white"
                />
              </div>

              <div>
                <div className="bg-[#0891B2]/10 dark:bg-[#0891B2]/20 rounded-xl p-4">
                  <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-1">Line Total</p>
                  <p className="text-2xl font-bold text-[#0891B2]">{formatCurrency(line.lineTotal)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {formData.lines.length === 0 && (
          <div className="text-center py-12 bg-[#F5F7FB] dark:bg-[#020617] rounded-2xl border-2 border-dashed border-[#E5E7EB] dark:border-[#1E293B]">
            <Pill className="w-12 h-12 text-[#E5E7EB] dark:text-[#1E293B] mx-auto mb-3" />
            <p className="text-[#6B7280] dark:text-[#94A3B8]">No medicines added yet</p>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="bg-gradient-to-br from-[#0891B2] to-[#0E7490] dark:from-[#0E7490] dark:to-[#155E75] rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4">Bill Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-[#A5F3FC]">Subtotal</span>
            <span className="text-xl font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-[#A5F3FC]">GST</span>
            <span className="text-xl font-semibold">{formatCurrency(gst)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold">Grand Total</span>
            <span className="text-3xl font-bold">{formatCurrency(grandTotal)}</span>
          </div>
          <p className="text-sm text-[#A5F3FC] pt-2 border-t border-white/20">
            {numberToWords(Math.floor(grandTotal))} Rupees Only
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-lg border-t border-[#E5E7EB] dark:border-[#1E293B] p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSave(false)}
            className="bg-[#6B7280] hover:bg-[#4B5563] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            className="bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
          >
            Save & Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyBilling;
