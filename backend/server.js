import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/todos', async (_req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = new Todo({ title: title.trim() });
  await todo.save();
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', async (req, res) => {
  const { completed } = req.body;
  const todo = await Todo.findByIdAndUpdate(req.params.id, { completed }, { new: true });

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json({ success: true });
});

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });
