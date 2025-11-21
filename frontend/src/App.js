import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <DataProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registration" element={<div className="p-4 text-center text-gray-500">Registration Page - Coming Soon</div>} />
                <Route path="/queue" element={<div className="p-4 text-center text-gray-500">Queue Page - Coming Soon</div>} />
                <Route path="/sync" element={<div className="p-4 text-center text-gray-500">Sync Page - Coming Soon</div>} />
                <Route path="/procedure-bill" element={<div className="p-4 text-center text-gray-500">Procedure Billing - Coming Soon</div>} />
                <Route path="/pharmacy-bill" element={<div className="p-4 text-center text-gray-500">Pharmacy Billing - Coming Soon</div>} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </DataProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;
