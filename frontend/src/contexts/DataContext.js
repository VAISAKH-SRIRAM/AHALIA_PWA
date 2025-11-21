import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockPatients, mockCampInfo } from '../mock';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('ahalia-patients');
    return saved ? JSON.parse(saved) : mockPatients;
  });

  const [procedureBills, setProcedureBills] = useState(() => {
    const saved = localStorage.getItem('ahalia-procedure-bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [pharmacyBills, setPharmacyBills] = useState(() => {
    const saved = localStorage.getItem('ahalia-pharmacy-bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastSync, setLastSync] = useState(() => {
    const saved = localStorage.getItem('ahalia-last-sync');
    return saved || null;
  });

  useEffect(() => {
    localStorage.setItem('ahalia-patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('ahalia-procedure-bills', JSON.stringify(procedureBills));
  }, [procedureBills]);

  useEffect(() => {
    localStorage.setItem('ahalia-pharmacy-bills', JSON.stringify(pharmacyBills));
  }, [pharmacyBills]);

  const addPatient = (patient) => {
    const campId = `CAMP-${String(patients.length + 1).padStart(3, '0')}`;
    const newPatient = {
      ...patient,
      id: campId,
      status: 'Waiting',
      timestamp: new Date().toISOString(),
      syncStatus: 'Local Only'
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id, updates) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addProcedureBill = (bill) => {
    const billId = `PB-${String(procedureBills.length + 1).padStart(4, '0')}`;
    const newBill = {
      ...bill,
      id: billId,
      timestamp: new Date().toISOString(),
      syncStatus: 'Local Only'
    };
    setProcedureBills(prev => [...prev, newBill]);
    return newBill;
  };

  const addPharmacyBill = (bill) => {
    const billId = `PHB-${String(pharmacyBills.length + 1).padStart(4, '0')}`;
    const newBill = {
      ...bill,
      id: billId,
      timestamp: new Date().toISOString(),
      syncStatus: 'Local Only'
    };
    setPharmacyBills(prev => [...prev, newBill]);
    return newBill;
  };

  const syncData = async () => {
    // Simulate sync - in real app, this would call Odoo API
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        setLastSync(now);
        localStorage.setItem('ahalia-last-sync', now);
        
        // Update sync status
        setPatients(prev => prev.map(p => ({ ...p, syncStatus: 'Synced as Draft' })));
        setProcedureBills(prev => prev.map(b => ({ ...b, syncStatus: 'Synced as Draft' })));
        setPharmacyBills(prev => prev.map(b => ({ ...b, syncStatus: 'Synced as Draft' })));
        
        resolve({ success: true });
      }, 2000);
    });
  };

  const getMetrics = () => {
    const totalPatients = patients.length;
    const referredToHospital = patients.filter(p => p.status === 'Referred').length;
    const waitingInQueue = patients.filter(p => p.status === 'Waiting').length;
    const unsyncedRecords = 
      patients.filter(p => p.syncStatus === 'Local Only').length +
      procedureBills.filter(b => b.syncStatus === 'Local Only').length +
      pharmacyBills.filter(b => b.syncStatus === 'Local Only').length;

    return {
      totalPatients,
      referredToHospital,
      waitingInQueue,
      unsyncedRecords
    };
  };

  return (
    <DataContext.Provider value={{
      patients,
      procedureBills,
      pharmacyBills,
      lastSync,
      addPatient,
      updatePatient,
      addProcedureBill,
      addPharmacyBill,
      syncData,
      getMetrics,
      campInfo: mockCampInfo
    }}>
      {children}
    </DataContext.Provider>
  );
};
