import { Component } from 'react';
import './PaymentForm.css';

class PaymentForm extends Component {
  state = {
    formData: {
      loan_id: '',
      amount: '',
      payment_type: 'EMI', 
    },
    result: '',
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      }
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { formData } = this.state;
    const payload = {
      amount: parseFloat(formData.amount),
      payment_type: formData.payment_type,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/v1/loans/${formData.loan_id}/payments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorMessage = 'Something is wrong';
        try {
          const errorData = await response.json();
          if (errorData.error) errorMessage = errorData.error;
          else if (errorData.message) errorMessage = errorData.message;
        } catch (e) { }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      this.setState({ result: data });
      alert('Payment Recorded');
    } catch (error) {
      console.log(error);
      alert(error.message || 'Something is Wrong');
    }
  };

  render() {
    const { formData, result } = this.state;
    const { loan_id, amount, payment_type } = formData;

    return (
      <div className='payment-form-container'>
        <h1>Record a Loan Payment</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            name="loan_id"
            placeholder="Loan ID"
            value={loan_id}
            onChange={this.handleChange}
            required
          /><br /><br />
          <input
            type="text"
            name="amount"
            placeholder="Payment Amount"
            value={amount}
            onChange={this.handleChange}
            required
          /><br /><br />
          <select
            name="payment_type"
            value={payment_type}
            onChange={this.handleChange}
            required
          >
            <option value="EMI">EMI</option>
            <option value="LUMP_SUM">Lump Sum</option>
          </select>
          <br /><br />
          <button type="submit">Submit</button>
        </form>

        {result && (
          <div className='result-container'>
            <h1>Payment Recorded:</h1>
            <p>Payment ID: {result.payment_id}</p>
            <p>Loan ID: {result.loan_id}</p>
            <p>Message: {result.message}</p>
            <p>Remaining Balance: {result.remaining_balance}</p>
            <p>EMIs Left: {result.emis_left}</p>
          </div>
        )}
      </div>
    );
  }
}

export default PaymentForm;
