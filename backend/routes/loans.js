const express = require('express');
const router = express.Router();
const {v4:uuidv4} = require('uuid');
const db = require('../db/db');

router.post('/loans', (request,response)=>{
    const {customer_id,loan_amount,loan_period_years,interest_rate_yearly} = request.body;

    if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
        return response.status(400).json({ error: "Missing required fields" });
    }

    const principal = parseFloat(loan_amount);
    const rate = parseFloat(interest_rate_yearly);
    const years = parseInt(loan_period_years);

    const interest = parseFloat((principal * years * (rate / 100)).toFixed(2));
    const total = interest + principal;
    const monthly_emi = parseFloat((total / (years * 12)).toFixed(2));
    const loan_id = uuidv4();
    const created_at = new Date().toISOString().split('T')[0];

    const query = `insert into Loans (loan_id,customer_id,principal_amount,total_amount,interest_rate,loan_period_years,monthly_emi,status,created_at)
    values(?,?,?,?,?,?,?,?,?)`;

    db.run(query, [loan_id,customer_id,loan_amount,total,interest_rate_yearly,loan_period_years,monthly_emi,'ACTIVE',created_at], function(error){
        if(error){
            return response.status(400).json({error:error.message || 'Insert Failed'});
        }

        response.status(201).json({
            loan_id,customer_id,total_amount_payable:total,monthly_emi,
        })
    })
});

module.exports = router;