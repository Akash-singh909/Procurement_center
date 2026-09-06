require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../serviceAccountKey.json'
    ),
  });
}

const db = admin.firestore();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'KisanSewa API running', version: '1.0.0' });
});

// Routes placeholder
const tokenRoutes = require('./routes/tokenRoutes');
app.use('/api/tokens', tokenRoutes);

const authMiddleware = require('./middleware/authMiddleware');

// Example protected route
app.get('/api/admin/stats', authMiddleware.verifyToken, async (req, res) => {
  try {
    const stats = await db.collection('stats').doc('daily').get();
    res.json({ data: stats.exists ? stats.data() : {} });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
