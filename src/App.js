import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

function App() {
const [showAddTask, setShowAddTask] = useState(false)
const [tasks,setTasks] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(()=>{
  const getTasks = async () => {
    try {
      setLoading(true)
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }
  getTasks()
},[])

// Fetch Tasks
const fetchTasks = async ()=>{
  try {
    const res = await fetch(`${API_BASE_URL}/tasks`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

// Fetch single task
const fetchTask = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching task:', error)
    throw error
  }
}

//Add Task
const addTask= async (task)=> {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks`,{
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    setTasks([...tasks, data])
    setError(null)
  } catch (error) {
    setError('Failed to add task')
    console.error('Error adding task:', error)
  }
}

// Update Task
const updateTask = async (id, updatedTask) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    setTasks(tasks.map(task => task.id === id ? data : task))
    setError(null)
  } catch (error) {
    setError('Failed to update task')
    console.error('Error updating task:', error)
  }
}

// Toggle reminder
const toggleReminder = async (id) => {
  try {
    const taskToToggle = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    await updateTask(id, updatedTask)
  } catch (error) {
    setError('Failed to toggle reminder')
    console.error('Error toggling reminder:', error)
  }
}

//Delete Task
async function deleteTask(id){
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`,{method: 'DELETE'})
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    setTasks(tasks.filter((task) => task.id !== id))
    setError(null)
  } catch (error) {
    setError('Failed to delete task')
    console.error('Error deleting task:', error)
  }
}

  return (
    <Router>
    <div className="container">
      <Header onAdd= {()=> setShowAddTask(!showAddTask)} showAdd= {showAddTask} />
      
      {error && (
        <div style={{
          color: 'red', 
          background: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '5px', 
          margin: '10px 0',
          border: '1px solid #ff0000'
        }}>
          {error}
        </div>
      )}
      
      <Routes>
        <Route exact path="/" element={
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {loading ? (
              <div>Loading tasks...</div>
            ) : tasks.length > 0 ? (
              <Tasks 
                tasks = {tasks} 
                onDelete= {deleteTask}
                onToggle= {toggleReminder}
              />
            ) : (
              <div>No Tasks</div>
            )}
          </>
        } />

        <Route path='/about' Component={About} />
      </Routes>
      <Footer />
    </div>
    </Router>
);
}

export default App;
