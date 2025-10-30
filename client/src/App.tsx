import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { RunnerTable } from './components/RunnerTable';
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<RunnerTable />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;