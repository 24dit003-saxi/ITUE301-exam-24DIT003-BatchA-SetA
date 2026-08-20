import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; 2026 MedCare Plus. All rights reserved.</p>
            <p className="footer-tag">Practical Exam Set A — Sakshi (24DIT003)</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
