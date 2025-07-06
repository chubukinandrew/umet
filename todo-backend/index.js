// index.js
console.log('RAILWAY ENV PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Моки
const mockTasks = [
  { id: 1, title: "Buy groceries" },
  { id: 2, title: "Walk the dog" },
  { id: 3, title: "Finish project" },
];

// Роут
app.get('/tasks', (req, res) => {
  res.json(mockTasks);
});

app.listen(PORT, () => {
  console.log(`✅ Mock API running on port ${PORT}`);
});
