import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
const [showAddTask, setShowAddTask] = useState(false)
const [tasks,setTasks] = useState('')

useEffect(()=>{
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }
  getTasks()
},[])

// Fetch Tasks
const fetchTasks = async ()=>{
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()
  return data
}

//Add Task
const addTask= async (task)=> {
const res = await fetch('http://localhost:5000/tasks',{
  method: "POST",
  headers: {
    'Content-type': 'application/json'
  },
  body: JSON.stringify(task)
  
})
const data = await res.json()
setTasks([...tasks, data])}

  // const id= Math.floor(Math.random()*10000)+1
// const newTask= {id, ...task}
// setTasks([...tasks, newTask])}

//Delete Task
async function deleteTask(id){
  await fetch(`http://localhost:5000/tasks/${id}`,{method: 'DELETE'})
  setTasks(tasks.filter((task) => 
    task.id !== id
  ))
}

  return (
    <Router>
    <div className="container">
      <Header onAdd= {()=> setShowAddTask(!showAddTask)} showAdd= {showAddTask} />
      <Routes>
      {/* <Route exact path="/" render={(props) => (
        <>
        {showAddTask && <AddTask onAdd={addTask} {...props} />}
        {tasks.length > 0 ? (
        <Tasks 
        tasks = {tasks} 
        onDelete= {deleteTask} 
        {...props} 
        />
        ) : ("No Tasks")
        }
        </>
      )} /> */}

<Route exact path="/" element={
        <>
        {showAddTask && <AddTask onAdd={addTask} />}
        {tasks.length > 0 ? (
        <Tasks 
        tasks = {tasks} 
        onDelete= {deleteTask}  
        />
        ) : ("No Tasks")
        }
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
