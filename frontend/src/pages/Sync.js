import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNetwork } from '../contexts/NetworkContext';
import { RefreshCw, FileText, Download, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const Sync = () => {
  const { getMetrics, syncData, lastSync, patients, procedureBills, pharmacyBills } = useData();
  const { isOnline } = useNetwork();
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const metrics = getMetrics();

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot sync while offline. Data will sync when online.",
        variant: "destructive"
      });
      return;
    }

    setSyncing(true);
    
    try {
      await syncData();
      toast({
        title: "Sync Complete",
        description: `Synced ${metrics.unsyncedRecords} records to Odoo as Draft`
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to sync data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export feature coming soon"
    });
  };

  const handleExportCSV = () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "CSV export only available when online",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Export CSV",
      description: "CSV export feature coming soon"
    });
  };

  const totalProcedureBillAmount = procedureBills.reduce((sum, bill) => sum + (bill.netAmount || 0), 0);
  const totalPharmacyBillAmount = pharmacyBills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16A34A] to-[#15803D] dark:from-[#15803D] dark:to-[#166534] rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Sync & Summary</h2>
        <p className="text-[#BBF7D0] dark:text-[#86EFAC] text-sm">
          Manage data synchronization and view camp summary
        </p>
      </div>

      {/* Sync Status Card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-lg border border-[#E5E7EB] dark:border-[#1E293B] p-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className={`w-5 h-5 text-[#16A34A] ${syncing ? 'animate-spin' : ''}`} />
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Sync Status</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FEF3C7] dark:bg-[#F59E0B]/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Unsynced Records</p>
              </div>
              <p className="text-3xl font-bold text-[#F59E0B]">{metrics.unsyncedRecords}</p>
              <div className="mt-2 space-y-1 text-xs text-[#6B7280] dark:text-[#94A3B8]">
                <p>Registrations: {patients.filter(p => p.syncStatus === 'Local Only').length}</p>
                <p>Procedure Bills: {procedureBills.filter(b => b.syncStatus === 'Local Only').length}</p>
                <p>Pharmacy Bills: {pharmacyBills.filter(b => b.syncStatus === 'Local Only').length}</p>
              </div>
            </div>

            <div className="bg-[#DCFCE7] dark:bg-[#16A34A]/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Synced Records</p>
              </div>
              <p className="text-3xl font-bold text-[#16A34A]">
                {patients.length + procedureBills.length + pharmacyBills.length - metrics.unsyncedRecords}
              </p>
              <p className="mt-2 text-xs text-[#6B7280] dark:text-[#94A3B8]">
                All synced as Draft in Odoo
              </p>
            </div>

            <div className="bg-[#DBEAFE] dark:bg-[#2563EB]/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-[#2563EB]" />
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Last Sync</p>
              </div>
              <p className="text-sm font-bold text-[#2563EB]">
                {lastSync ? new Date(lastSync).toLocaleString() : 'Never'}
              </p>
              <p className="mt-2 text-xs text-[#6B7280] dark:text-[#94A3B8]">
                {isOnline ? 'Online - Ready to sync' : 'Offline - Will sync when online'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing || metrics.unsyncedRecords === 0}
            className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#6B7280] disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : metrics.unsyncedRecords === 0 ? 'All Synced' : `Sync Now (${metrics.unsyncedRecords} records)`}
          </button>

          {!isOnline && (
            <div className="bg-[#FEF3C7] dark:bg-[#F59E0B]/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#F59E0B] mb-1">Offline Mode</p>
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                  All data is saved locally. Records will automatically sync to Odoo when connection is restored.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camp Summary Metrics */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-lg border border-[#E5E7EB] dark:border-[#1E293B] p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Camp Summary</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-2">Total Registrations</p>
            <p className="text-3xl font-bold text-[#2563EB]">{metrics.totalPatients}</p>
          </div>

          <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-2">Procedure Bills</p>
            <p className="text-3xl font-bold text-[#7C3AED]">{procedureBills.length}</p>
          </div>

          <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-2">Pharmacy Bills</p>
            <p className="text-3xl font-bold text-[#0891B2]">{pharmacyBills.length}</p>
          </div>

          <div className="bg-[#F5F7FB] dark:bg-[#020617] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mb-2">Referred</p>
            <p className="text-3xl font-bold text-[#EF4444]">{metrics.referredToHospital}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#E5E7EB] dark:border-[#1E293B]">
          <h4 className="text-sm font-semibold text-[#6B7280] dark:text-[#94A3B8] mb-4">FINANCIAL SUMMARY</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#7C3AED]/10 to-[#6D28D9]/10 dark:from-[#7C3AED]/20 dark:to-[#6D28D9]/20 rounded-xl p-5 border border-[#7C3AED]/20">
              <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-2">Total Procedure Billing</p>
              <p className="text-2xl font-bold text-[#7C3AED]">{formatCurrency(totalProcedureBillAmount)}</p>
            </div>

            <div className="bg-gradient-to-br from-[#0891B2]/10 to-[#0E7490]/10 dark:from-[#0891B2]/20 dark:to-[#0E7490]/20 rounded-xl p-5 border border-[#0891B2]/20">
              <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-2">Total Pharmacy Billing</p>
              <p className="text-2xl font-bold text-[#0891B2]">{formatCurrency(totalPharmacyBillAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-lg border border-[#E5E7EB] dark:border-[#1E293B] p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Export Data</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold rounded-xl transition-all active:scale-95 group"
          >
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Export Summary as PDF
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!isOnline}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#6B7280] disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-95 group"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Download CSV
          </button>
        </div>

        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-4 text-center">
          {isOnline ? 'Export features available' : 'CSV export only available when online'}
        </p>
      </div>

      {/* Sync Info */}
      <div className="bg-[#DBEAFE] dark:bg-[#2563EB]/10 rounded-2xl p-6 border border-[#2563EB]/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-[#2563EB] mb-2">How Sync Works</h4>
            <ul className="space-y-1 text-xs text-[#6B7280] dark:text-[#94A3B8]">
              <li>• All local records are stored in your browser's storage</li>
              <li>• When online, click "Sync Now" to push data to Odoo backend</li>
              <li>• All synced records appear in Odoo in <strong>Draft</strong> state for review</li>
              <li>• Odoo admin can review and approve/edit drafts before finalizing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sync;
