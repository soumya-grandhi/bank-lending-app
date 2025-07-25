import { Component } from 'react';
import './LoanLedger.css';

class LoanLedger extends Component {
  state = {
    loan_id: '',
    data: null,
    loading: false,
    error: '',
  };

  handleChange = (event) => {
    this.setState({ loan_id: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { loan_id } = this.state;

    if (!loan_id.trim()) {
      alert('Please enter a Loan ID');
      return;
    }

    this.setState({ loading: true, data: null, error: '' });

    try {
      const response = await fetch(`http://localhost:3000/api/v1/loans/${loan_id}/ledger`);

      if (!response.ok) {
        let errorMessage = 'Something went wrong';
        try {
          const errorData = await response.json();
          if (errorData.error) errorMessage = errorData.error;
          else if (errorData.message) errorMessage = errorData.message;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error: error.message || 'Something went wrong', loading: false });
      alert(error.message || 'Something went wrong');
    }
  };

  render() {
    const { loan_id, data, loading, error } = this.state;

    return (
      <div className='loan-ledger-container'>
        <h1>View Loan Ledger</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="loan_id"
            placeholder="Enter Loan ID"
            value={loan_id}
            onChange={this.handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'View Ledger'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {data && (
          <div style={{ marginTop: '20px' }}>
            <h2>Loan Details</h2>
            <p><strong>Loan ID:</strong> {data.loan_id}</p>
            <p><strong>Customer ID:</strong> {data.customer_id}</p>
            <p><strong>Principal:</strong> {data.principal}</p>
            <p><strong>Total Amount:</strong> {data.total_amount}</p>
            <p><strong>Monthly EMI:</strong> {data.monthly_emi}</p>
            <p><strong>Amount Paid:</strong> {data.amount_paid}</p>
            <p><strong>Balance Amount:</strong> {data.balance_amount}</p>
            <p><strong>EMIs Left:</strong> {data.emis_left}</p>

            <h3>Transaction History</h3>
            {data.transactions.length === 0 ? (
              <p>No transactions found for this loan.</p>
            ) : (
              <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((txn) => (
                    <tr key={txn.transaction_id}>
                      <td>{txn.transaction_id}</td>
                      <td>{new Date(txn.date).toLocaleString()}</td>
                      <td>{txn.amount}</td>
                      <td>{txn.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default LoanLedger;
