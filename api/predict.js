// api/predict.js
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

// ✅ Middleware para liberar CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ou 'http://localhost:5173' para restringir
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/api/predict', (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'hermes_predictions.csv');
    const csvData = fs.readFileSync(filePath, 'utf-8').trim();
    const [headerLine, ...rows] = csvData.split('\n');
    const headers = headerLine.split(',');

    const data = rows.map((line) => {
      const values = line.split(',');
      return headers.reduce((obj, header, idx) => {
        obj[header] = values[idx];
        return obj;
      }, {});
    });

    res.status(200).json({ palpites: data });
  } catch (err) {
    console.error('[predict] Erro ao processar CSV:', err);
    res.status(500).json({ error: 'Erro ao processar CSV.' });
  }
});

export default function handler(req, res) {
  app.handle(req, res);
}
