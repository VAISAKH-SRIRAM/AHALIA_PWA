import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { mockProcedures, mockDoctors } from '../mock';
import { formatCurrency, numberToWords } from '../utils/helpers';
import { FileText, Plus, Trash2, ChevronDown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const ProcedureBilling = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addProcedureBill } = useData();
  const { toast } = useToast();
  const patient = location.state?.patient;

  const [formData, setFormData] = useState({
    patientId: patient?.id || '',
    patientName: patient?.fullName || '',
    campPlace: patient?.campPlace || '',
    patientCategory: patient?.patientCategory || 'General',
    procedureCategory: 'Diagnostics',
    billType: 'Camp',
    patientBillType: 'General',
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
          procedure: null,
          quantity: 1,
          unitPrice: 0,
          discountPercent: 0,
          discountAmount: 0,
          specialDiscount: 0,
          lineAmount: 0
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

      if (field === 'procedure') {
        const proc = mockProcedures.find(p => p.id === parseInt(value));
        if (proc) {
          line.procedure = proc;
          line.unitPrice = proc.price;
          line.discountPercent = proc.discount;
        }
      } else {
        line[field] = value;
      }

      // Calculate line amount
      const subtotal = line.unitPrice * line.quantity;
      const categoryDiscount = (subtotal * line.discountPercent) / 100;
      const finalAmount = subtotal - categoryDiscount - line.specialDiscount;
      line.discountAmount = categoryDiscount;
      line.lineAmount = Math.max(0, finalAmount);

      newLines[index] = line;
      return { ...prev, lines: newLines };
    });
  };

  const calculateTotals = () => {
    const total = formData.lines.reduce((sum, line) => sum + (line.unitPrice * line.quantity), 0);
    const discount = formData.lines.reduce((sum, line) => sum + line.discountAmount + line.specialDiscount, 0);
    const netAmount = total - discount;
    return { total, discount, netAmount };
  };

  const handleSave = (print = false) => {
    if (formData.lines.length === 0) {
      toast({
        title: "No procedures added",
        description: "Please add at least one procedure",
        variant: "destructive"
      });
      return;
    }

    const { total, discount, netAmount } = calculateTotals();
    const bill = {
      ...formData,
      total,
      discount,
      netAmount,
      status: 'Draft'
    };

    const savedBill = addProcedureBill(bill);
    
    toast({
      title: "Procedure bill saved",
      description: `Bill ${savedBill.id} saved as draft`
    });

    if (print) {
      setTimeout(() => window.print(), 500);
    }

    setTimeout(() => navigate('/queue'), 1000);
  };

  const { total, discount, netAmount } = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-32">
      <Toaster />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] dark:from-[#6D28D9] dark:to-[#5B21B6] rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Procedure Billing</h2>
            <p className="text-[#C4B5FD] dark:text-[#DDD6FE] text-sm">
              {patient ? `${patient.id} · ${patient.fullName}` : 'Create new procedure bill'}
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-sm">
            DRAFT
          </div>
        </div>
      </div>

      {/* Bill Details */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#7C3AED]" />
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Bill Details</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Procedure Category</label>
            <select
              value={formData.procedureCategory}
              onChange={(e) => setFormData(prev => ({ ...prev, procedureCategory: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
            >
              <option>Diagnostics</option>
              <option>Ophthalmology</option>
              <option>Cardiology</option>
              <option>Consultation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Bill Type</label>
            <select
              value={formData.billType}
              onChange={(e) => setFormData(prev => ({ ...prev, billType: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
            >
              <option>Camp</option>
              <option>Regular</option>
              <option>Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Patient Bill Type</label>
            <div className="flex gap-2">
              {['General', 'Insurance'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, patientBillType: type }))}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    formData.patientBillType === type
                      ? 'bg-[#7C3AED] text-white shadow-lg'
                      : 'bg-[#F5F7FB] dark:bg-[#020617] text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#1E293B]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Doctor</label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
            >
              {mockDoctors.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Summary */}
      {patient && (
        <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-2xl border border-[#E5E7EB] dark:border-[#1E293B] p-6">
          <h3 className="text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] mb-3">PATIENT SUMMARY</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Patient</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{patient.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Camp MR</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{patient.id}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Camp Place</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{patient.campPlace}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-1">Category</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{patient.patientCategory}</p>
            </div>
          </div>
        </div>
      )}

      {/* Procedure Lines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Procedures</h3>
          <button
            onClick={addLine}
            className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-xl transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Procedure
          </button>
        </div>

        {formData.lines.map((line, index) => (
          <div key={index} className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-sm font-bold text-[#7C3AED]">Line {index + 1}</h4>
              <button
                onClick={() => removeLine(index)}
                className="text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#EF4444]/20 p-2 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Procedure</label>
                <select
                  value={line.procedure?.id || ''}
                  onChange={(e) => updateLine(index, 'procedure', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
                >
                  <option value="">Select procedure</option>
                  {mockProcedures.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
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
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Discount %</label>
                <input
                  type="number"
                  value={line.discountPercent}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-[#F5F7FB] dark:bg-[#020617] text-[#0F172A] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-2">Special Discount</label>
                <input
                  type="number"
                  min="0"
                  value={line.specialDiscount}
                  onChange={(e) => updateLine(index, 'specialDiscount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 rounded-xl p-4">
                  <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-1">Line Amount</p>
                  <p className="text-2xl font-bold text-[#7C3AED]">{formatCurrency(line.lineAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {formData.lines.length === 0 && (
          <div className="text-center py-12 bg-[#F5F7FB] dark:bg-[#020617] rounded-2xl border-2 border-dashed border-[#E5E7EB] dark:border-[#1E293B]">
            <FileText className="w-12 h-12 text-[#E5E7EB] dark:text-[#1E293B] mx-auto mb-3" />
            <p className="text-[#6B7280] dark:text-[#94A3B8]">No procedures added yet</p>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] dark:from-[#6D28D9] dark:to-[#5B21B6] rounded-2xl shadow-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4">Bill Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-[#DDD6FE]">Total</span>
            <span className="text-xl font-semibold">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/20">
            <span className="text-[#DDD6FE]">Discount</span>
            <span className="text-xl font-semibold">- {formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold">Net Amount</span>
            <span className="text-3xl font-bold">{formatCurrency(netAmount)}</span>
          </div>
          <p className="text-sm text-[#DDD6FE] pt-2 border-t border-white/20">
            {numberToWords(Math.floor(netAmount))} Rupees Only
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
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
          >
            Save & Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcedureBilling;
