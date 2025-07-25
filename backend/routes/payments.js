const express = require('express');
const router = express.Router();
const {v4:uuidv4} = require('uuid');
const db = require('../db/db');

router.post('/loans/:loan_id/payments', (req,res)=>{
    const {amount,payment_type} = req.body;
    const {loan_id} = req.params;
    const payment_id = uuidv4();

    if(!amount || !payment_type){
        return res.status(400).json({error:"Missing Require Fields"});
    }

    db.get(
        "SELECT * FROM Loans WHERE loan_id = ?",
        [loan_id],
        (err, loan) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!loan) return res.status(404).json({ error: "Loan not found." });

        db.get(
            "SELECT IFNULL(SUM(amount),0) as total_paid FROM Payments WHERE loan_id = ?",
            [loan_id],
            (err, paymentRow) => {
            if (err) return res.status(500).json({ error: err.message });

            const totalPaidBefore = paymentRow.total_paid || 0;
            const principal = loan.total_amount;
            const remainingBefore = principal - totalPaidBefore;
            const newRemaining = remainingBefore - parseFloat(amount);

            if (newRemaining < -0.01) {
                return res.status(400).json({ error: "Payment exceeds outstanding balance." });
            }

            db.run(
                `INSERT INTO Payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)`,
                [payment_id, loan_id, amount, payment_type],
                function (err) {
                if (err) return res.status(500).json({ error: err.message });

                let emis_left = 0;
                if (loan.monthly_emi > 0) {
                    emis_left = Math.max(0, Math.ceil((newRemaining) / loan.monthly_emi));
                }

              return res.status(200).json({
                payment_id,
                loan_id,
                message: "Payment recorded successfully.",
                remaining_balance: Math.max(0, newRemaining),
                emis_left
              });
            }
          );
        }
      );
    }
  );
})

module.exports = router;