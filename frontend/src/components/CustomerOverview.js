import {Component} from 'react';
import './CustomerOverview.css';

class CustomerOverview extends Component{
    state = {
    customer_id: '',
    data: null,
    loading: false,
    error: '',
  };

  handleChange = (event) => {
    this.setState({ customer_id: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { customer_id } = this.state;

    if (!customer_id.trim()) {
      alert('Please enter a Customer ID');
      return;
    }

    this.setState({ loading: true, data: null, error: '' });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/v1/customers/${customer_id}/overview`);

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
    const { customer_id, data, loading, error } = this.state;

    return (
      <div className='customer-overview-container'>
        <h1>Customer Account Overview</h1>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="customer_id"
            placeholder="Enter Customer ID"
            value={customer_id}
            onChange={this.handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get Overview'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {data && (
          <div style={{ marginTop: '20px' }}>
            <h2>Customer: {data.customer_id}</h2>
            <p>Total Loans: {data.total_loans}</p>

            {data.loans.length === 0 ? (
              <p>No loans found for this customer.</p>
            ) : (
              <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: 10 }}>
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Principal</th>
                    <th>Total Amount</th>
                    <th>Total Interest</th>
                    <th>EMI Amount</th>
                    <th>Amount Paid</th>
                    <th>EMIs Left</th>
                  </tr>
                </thead>
                <tbody>
                  {data.loans.map((loan) => (
                    <tr key={loan.loan_id}>
                      <td>{loan.loan_id}</td>
                      <td>{loan.principal}</td>
                      <td>{loan.total_amount}</td>
                      <td>{loan.total_interest}</td>
                      <td>{loan.emi_amount}</td>
                      <td>{loan.amount_paid}</td>
                      <td>{loan.emis_left}</td>
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

export default CustomerOverview;