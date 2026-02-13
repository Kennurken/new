const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Бұл біздің уақытша базамыз (массив)
let specialists = [
  { id: 1, name: "Арман", profession: "Сантехник", phone: "87071112233", lat: 43.238, lon: 76.889 }
];

app.get('/api/specialists', (req, res) => {
  res.json(specialists);
});

app.post('/api/specialists', (req, res) => {
  const newSpecialist = { id: Date.now(), ...req.body };
  specialists.push(newSpecialist);
  res.json(newSpecialist);
});

// Маманды ID бойынша өшіру
app.delete('/api/specialists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM specialists WHERE id = $1', [id]);
    res.json({ message: "Маман өшірілді" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Өшіру кезінде қате кетті');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Уақытша сервер http://localhost:${PORT} портында қосылды! 🚀`);
});