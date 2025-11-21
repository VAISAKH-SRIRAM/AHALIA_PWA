import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Queue from './pages/Queue';
import ProcedureBilling from './pages/ProcedureBilling';
import PharmacyBilling from './pages/PharmacyBilling';
import Sync from './pages/Sync';

function App() {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <DataProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/queue" element={<Queue />} />
                <Route path="/procedure-bill" element={<ProcedureBilling />} />
                <Route path="/pharmacy-bill" element={<PharmacyBilling />} />
                <Route path="/sync" element={<Sync />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </DataProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;
