import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import LoanForm from './components/LoanForm';
import PaymentForm from './components/PaymentForm';
import LoanLedger from './components/LoanLedger'
import CustomerOverview from './components/CustomerOverview';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <h1>Bank Lending System</h1>
          <nav>
            <Link to="/loan" style={{ marginRight: 20 }}>Create Loan</Link>
            <Link to="/payment" style={{ marginRight: 20 }}>Record Payment</Link>
            <Link to='/ledger' style={{ marginRight: 20 }}>View Loan Details</Link>
            <Link to='/overview'>Customer Overview</Link>
          </nav>
          <hr />
          <Routes>
            <Route path="/" element={<Navigate to="/loan" replace />} />
            
            <Route path="/loan" element={<LoanForm />} />
            <Route path="/payment" element={<PaymentForm />} />
            <Route path='/ledger' element={<LoanLedger/>} />
            <Route path='/overview' element={<CustomerOverview/>} />

            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
