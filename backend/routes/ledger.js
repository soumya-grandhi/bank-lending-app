const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/loans/:loan_id/ledger', (req, res) => {
  const { loan_id } = req.params;

  db.get(
    `SELECT 
       loan_id, customer_id, principal_amount as principal, 
       total_amount, monthly_emi 
     FROM Loans WHERE loan_id = ?`,
    [loan_id],
    (err, loan) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!loan) return res.status(404).json({ error: "Loan not found." });

      db.get(
        `SELECT IFNULL(SUM(amount), 0) AS amount_paid FROM Payments WHERE loan_id = ?`,
        [loan_id],
        (err, paymentRow) => {
          if (err) return res.status(500).json({ error: err.message });

          const amount_paid = paymentRow.amount_paid || 0;
          const balance_amount = loan.total_amount - amount_paid;
          const emis_left = loan.monthly_emi > 0
            ? Math.max(0, Math.ceil(balance_amount / loan.monthly_emi))
            : 0;

          db.all(
            `SELECT 
               payment_id AS transaction_id, 
               payment_date AS date, 
               amount, 
               payment_type AS type 
             FROM Payments 
             WHERE loan_id = ? 
             ORDER BY payment_date ASC`,
            [loan_id],
            (err, transactions) => {
              if (err) return res.status(500).json({ error: err.message });

              res.status(200).json({
                loan_id: loan.loan_id,
                customer_id: loan.customer_id,
                principal: loan.principal,
                total_amount: loan.total_amount,
                monthly_emi: loan.monthly_emi,
                amount_paid,
                balance_amount,
                emis_left,
                transactions,
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;