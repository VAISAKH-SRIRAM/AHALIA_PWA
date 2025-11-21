import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useNetwork } from '../contexts/NetworkContext';
import { Users, TrendingUp, Clock, UserPlus, ClipboardList, FileText } from 'lucide-react';
import FlashNews from '../components/FlashNews';

const Home = () => {
  const navigate = useNavigate();
  const { campInfo, getMetrics } = useData();
  const { isOnline } = useNetwork();
  const [metrics, setMetrics] = useState({ totalPatients: 0, referredToHospital: 0, waitingInQueue: 0 });
  const [animatedMetrics, setAnimatedMetrics] = useState({ totalPatients: 0, referredToHospital: 0, waitingInQueue: 0 });

  useEffect(() => {
    const currentMetrics = getMetrics();
    setMetrics(currentMetrics);

    // Animate numbers
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    Object.keys(currentMetrics).forEach((key) => {
      let current = 0;
      const increment = currentMetrics[key] / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= currentMetrics[key]) {
          current = currentMetrics[key];
          clearInterval(timer);
        }
        setAnimatedMetrics(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, interval);
    });
  }, [getMetrics]);

  const quickActions = [
    { icon: UserPlus, label: 'New Registration', path: '/registration', color: 'bg-[#2563EB] hover:bg-[#1D4ED8]' },
    { icon: Clock, label: 'Open Queue', path: '/queue', color: 'bg-[#16A34A] hover:bg-[#15803D]' },
    { icon: ClipboardList, label: 'Procedure Bill', path: '/procedure-bill', color: 'bg-[#7C3AED] hover:bg-[#6D28D9]' },
    { icon: FileText, label: 'Summary', path: '/sync', color: 'bg-[#0891B2] hover:bg-[#0E7490]' }
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-white to-[#EFF6FF] dark:from-[#0F172A] dark:to-[#1E293B] rounded-2xl shadow-lg border border-[#E5E7EB] dark:border-[#1E293B] overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-2">
                Ahalia Group of Hospitals
              </h2>
              <div className="space-y-1">
                <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-2">
                  <span className="font-medium">{campInfo.campDate}</span>
                  <span className="w-1 h-1 rounded-full bg-[#6B7280] dark:bg-[#94A3B8]" />
                  <span>{campInfo.campLocation}</span>
                </p>
                <p className="text-base font-semibold text-[#2563EB] dark:text-[#3B82F6]">
                  {campInfo.campName}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide ${
              isOnline 
                ? 'bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/30' 
                : 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/30'
            }`}>
              {isOnline ? 'LIVE' : 'OFFLINE MODE'}
            </div>
          </div>
        </div>
      </div>

      {/* Flash News */}
      <FlashNews />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6 hover:shadow-xl transition-all cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-[#2563EB] dark:text-[#3B82F6] group-hover:scale-110 transition-transform" />
            <div className="text-xs font-medium text-[#16A34A] dark:text-[#22C55E] bg-[#DCFCE7] dark:bg-[#16A34A]/20 px-2 py-1 rounded-full">
              +{Math.floor(animatedMetrics.totalPatients * 0.3)} today
            </div>
          </div>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-1 font-medium">Total Patients</p>
          <p className="text-4xl font-bold text-[#0F172A] dark:text-white">
            {animatedMetrics.totalPatients}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6 hover:shadow-xl transition-all cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-[#EF4444] dark:text-[#F87171] group-hover:scale-110 transition-transform" />
            <div className="text-xs font-medium text-[#EF4444] dark:text-[#F87171] bg-[#FEE2E2] dark:bg-[#EF4444]/20 px-2 py-1 rounded-full">
              Critical
            </div>
          </div>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-1 font-medium">Referred to Hospital</p>
          <p className="text-4xl font-bold text-[#0F172A] dark:text-white">
            {animatedMetrics.referredToHospital}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-md border border-[#E5E7EB] dark:border-[#1E293B] p-6 hover:shadow-xl transition-all cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 text-[#F59E0B] dark:text-[#FCD34D] group-hover:scale-110 transition-transform" />
            <div className="text-xs font-medium text-[#F59E0B] dark:text-[#FCD34D] bg-[#FEF3C7] dark:bg-[#F59E0B]/20 px-2 py-1 rounded-full">
              Active
            </div>
          </div>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mb-1 font-medium">Waiting in Queue</p>
          <p className="text-4xl font-bold text-[#0F172A] dark:text-white">
            {animatedMetrics.waitingInQueue}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-4 px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className={`${action.color} text-white rounded-2xl p-6 shadow-lg transition-all active:scale-95 hover:shadow-xl group`}
              >
                <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-base font-semibold text-left">{action.label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
