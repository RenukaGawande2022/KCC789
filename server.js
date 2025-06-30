const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let kccData = [];
let priData = [];

app.post('/submit-kcc', (req, res) => {
    const {
        accountNo, name,
        withdrawalDate, withdrawalAmount,
        repaymentDate, repaymentAmount,
        isAmount, priAmount
    } = req.body;

    kccData.push({
        accountNo, name,
        withdrawalDate, withdrawalAmount,
        repaymentDate, repaymentAmount,
        isAmount, priAmount
    });

    res.json({ success: true });
});

app.post('/submit-pri', (req, res) => {
    priData.push(req.body);
    res.json({ success: true });
});

app.get('/export-kcc', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('KCC Transactions');

    sheet.columns = [
        { header: 'Account Number', key: 'accountNo' },
        { header: 'Farmer Name', key: 'name' },
        { header: 'Withdrawal Date', key: 'withdrawalDate' },
        { header: 'Withdrawal Amount', key: 'withdrawalAmount' },
        { header: 'Repayment Date', key: 'repaymentDate' },
        { header: 'Repayment Amount', key: 'repaymentAmount' },
        { header: 'IS @1.5%', key: 'isAmount' },
        { header: 'PRI @3%', key: 'priAmount' }
    ];

    sheet.addRows(kccData);

    const filePath = path.join(__dirname, 'kcc_data.xlsx');
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath);
});

app.get('/export-pri', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('PRI Data');
    sheet.columns = [
        { header: 'Village Name', key: 'village' },
        { header: 'PRI Code', key: 'code' }
    ];
    sheet.addRows(priData);

    const filePath = path.join(__dirname, 'pri_data.xlsx');
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
