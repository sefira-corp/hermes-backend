// api/predict.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Caminho absoluto para o CSV salvo no repositório
    const filePath = path.join(process.cwd(), 'data', 'hermes_predictions.csv');

    // Lê o CSV
    const csvData = fs.readFileSync(filePath, 'utf-8');

    // Converte para JSON
    const rows = csvData.trim().split('\n');
    const headers = rows.shift().split(',');

    const data = rows.map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, idx) => {
        obj[header] = values[idx];
        return obj;
      }, {});
    });

    res.status(200).json({ palpites: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar CSV." });
  }
}
