import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const port = 3200;

// InfluxDB v3 Configuration (from .env)
const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_DB = process.env.INFLUX_DB;

// Middleware
app.use(bodyParser.json());

// Route to handle SQL queries
app.post('/query', async (req, res) => {
  try {
    const { query } = req.body;

    const response = await axios.get(INFLUX_URL, {
      params: {
        db: INFLUX_DB,
        q: query,
      },
      headers: {
        'Authorization': `Token ${INFLUX_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Query failed:', error.message);
    res.status(500).json({
      error: (error.response && error.response.data && error.response.data.message) || error.message,
    });
  }
});

// Serve static files
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://192.168.0.14:${port}`);
});
