import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Modèles
const BillSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'pending' },
  proof: { type: String }
});

const Bill = mongoose.model('Bill', BillSchema);

// Routes pour les factures
app.get('/bills', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/bills', upload.single('proof'), async (req, res) => {
  try {
    const metadata = JSON.parse(req.body.metadata);
    const bill = new Bill({
      ...metadata,
      proof: req.file ? `/uploads/${req.file.filename}` : null
    });
    const savedBill = await bill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/bills/:id', upload.single('proof'), async (req, res) => {
  try {
    const metadata = JSON.parse(req.body.metadata);
    const updateData = {
      ...metadata,
      proof: req.file ? `/uploads/${req.file.filename}` : undefined
    };
    const bill = await Bill.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/bills/:id', async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Facture supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Création du dossier uploads s'il n'existe pas
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 