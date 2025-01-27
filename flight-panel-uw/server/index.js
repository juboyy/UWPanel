const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurações do CORS e middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Rota proxy para a API do ForeFlight
app.get('/api/flights', async (req, res) => {
  try {
    const response = await axios.get('https://public-api.foreflight.com/public/api/flights', {
      headers: {
        'ff-api-key': 's2NNDar9HUSM5MaOqHllc98OxRbK5mx5tRw1H7LD/ws=',
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// Serve o app React para outras rotas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
