import {Component} from 'react';
import './LoanForm.css'

class LoanForm extends Component{
    state={formData:{customer_id:'',loan_amount:'',loan_period_years:'',interest_rate_yearly:''},result:''} 

    handleChange = event => {
        const {name,value} = event.target
        this.setState(prevState=>({
            formData: {
                ...prevState.formData,
                [name]:value
            }
        }));
    }

    handleSubmit = async event => {
        event.preventDefault();
        const {formData} = this.state

        const payload = {
            customer_id: formData.customer_id, 
            loan_amount: parseFloat(formData.loan_amount),
            loan_period_years: parseInt(formData.loan_period_years),
            interest_rate_yearly: parseFloat(formData.interest_rate_yearly)
        };


        try{
            const response = await fetch('http://localhost:3000/api/v1/loans',{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
            });

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
            this.setState({result:data});
            alert('Loan Created')
        } catch(error){
            console.log(error);
            alert(error.message || "Something is Wrong");
        }
    };

    render(){
        const {formData,result} = this.state
        const {customer_id,loan_amount,loan_period_years,interest_rate_yearly} = formData;

        return(
            <div className='loan-form-container'>
                <h1>Create a Loan</h1>
                <form onSubmit={this.handleSubmit}>
                    <input name="customer_id" placeholder="Customer ID" value={customer_id} onChange={this.handleChange} required /><br /><br />
                    <input type="text" name="loan_amount" placeholder="Loan Amount" value={loan_amount} onChange={this.handleChange} required /><br /><br />
                    <input type="text" name="loan_period_years" placeholder="Period (Years)" value={loan_period_years} onChange={this.handleChange} required /><br /><br />
                    <input type="text" name="interest_rate_yearly" placeholder="Interest Rate (%)" value={interest_rate_yearly} onChange={this.handleChange} required /><br /><br />
                    <button type="submit">Submit</button>
                </form>

                {result && (
                    <div className='result-container'>
                        <h1>Loan Created: </h1>
                        <p>Loan ID: {result.loan_id}</p>
                        <p>Total Payment: {result.total_amount_payable}</p>
                        <p>Monthly EMI: {result.monthly_emi}</p>
                    </div>
                )}
            </div>
        )
    }
}

export default LoanForm;