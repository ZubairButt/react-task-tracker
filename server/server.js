const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the data file
const dataFile = path.join(__dirname, '../db.json');

// Helper function to read data from db.json
const readData = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { tasks: [] };
  }
};

// Helper function to write data to db.json
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

// GET all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const data = readData();
    res.json(data.tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET single task by ID
app.get('/api/tasks/:id', (req, res) => {
  try {
    const data = readData();
    const task = data.tasks.find(t => t.id === parseInt(req.params.id));
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST new task
app.post('/api/tasks', (req, res) => {
  try {
    const { text, day, reminder } = req.body;
    
    if (!text || !day) {
      return res.status(400).json({ error: 'Text and day are required' });
    }
    
    const data = readData();
    const newTask = {
      id: data.tasks.length > 0 ? Math.max(...data.tasks.map(t => t.id)) + 1 : 1,
      text,
      day,
      reminder: reminder || false
    };
    
    data.tasks.push(newTask);
    
    if (writeData(data)) {
      res.status(201).json(newTask);
    } else {
      res.status(500).json({ error: 'Failed to save task' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { text, day, reminder } = req.body;
    
    const data = readData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task properties
    if (text !== undefined) data.tasks[taskIndex].text = text;
    if (day !== undefined) data.tasks[taskIndex].day = day;
    if (reminder !== undefined) data.tasks[taskIndex].reminder = reminder;
    
    if (writeData(data)) {
      res.json(data.tasks[taskIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update task' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const data = readData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = data.tasks.splice(taskIndex, 1)[0];
    
    if (writeData(data)) {
      res.json(deletedTask);
    } else {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});