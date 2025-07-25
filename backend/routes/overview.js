const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/customers/:customer_id/overview', (req, res) => {
  const { customer_id } = req.params;

  db.get(
    'SELECT * FROM Customers WHERE customer_id = ?',
    [customer_id],
    (err, customer) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!customer) return res.status(404).json({ error: 'Customer not found.' });

      db.all(
        `SELECT
           loan_id,
           principal_amount AS principal,
           total_amount,
           -- Calculate total_interest = total_amount - principal
           (total_amount - principal_amount) AS total_interest,
           monthly_emi AS emi_amount
         FROM Loans
         WHERE customer_id = ?`,
        [customer_id],
        (err, loans) => {
          if (err) return res.status(500).json({ error: err.message });
          if (!loans || loans.length === 0)
            return res.status(404).json({ error: 'No loans found for this customer.' });

          const getPaymentsSummary = (loan) => {
            return new Promise((resolve, reject) => {
              db.get(
                `SELECT IFNULL(SUM(amount),0) AS amount_paid FROM Payments WHERE loan_id = ?`,
                [loan.loan_id],
                (err, paymentRow) => {
                  if (err) return reject(err);

                  const amount_paid = paymentRow.amount_paid || 0;
                  const balance_amount = loan.total_amount - amount_paid;
                  const emis_left = loan.emi_amount > 0
                    ? Math.max(0, Math.ceil(balance_amount / loan.emi_amount))
                    : 0;

                  resolve({
                    ...loan,
                    amount_paid,
                    emis_left,
                  });
                }
              );
            });
          };

          Promise.all(loans.map(getPaymentsSummary))
            .then(loansWithPayments => {
              const total_loans = loansWithPayments.length;

              res.status(200).json({
                customer_id,
                total_loans,
                loans: loansWithPayments,
              });
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        }
      );
    }
  );
});

module.exports = router;