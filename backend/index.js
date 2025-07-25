const express = require('express');
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3000;

app.use('/api/v1', require('./routes/loans'));
app.use('/api/v1', require('./routes/payments'));
app.use('/api/v1', require('./routes/ledger'));
app.use('/api/v1', require('./routes/overview'));

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});