import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

const seedTodos = [
  { title: 'Learn Docker Compose', completed: false },
  { title: 'Connect React frontend to backend', completed: false },
  { title: 'Store todos in MongoDB Atlas', completed: false },
];

async function seed() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
    });

    console.log('Connected to MongoDB for seeding.');

    const count = await Todo.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} todos. Skipping seed.`);
      process.exit(0);
    }

    const result = await Todo.insertMany(seedTodos);
    console.log(`Inserted ${result.length} todos.`);
    process.exit(0);
  } catch (error) {
    console.error('MongoDB seed failed:', error);
    process.exit(1);
  }
}

seed();
