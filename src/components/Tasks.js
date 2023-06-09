import Task from "./Task";


function Tasks({tasks, onDelete}) {
    
  return (
    <>
    {tasks.map((task, index) => (
        <Task key={index} task= {task} onDelete= {onDelete}/>
    )
        
    )}
    </>
  )
}

export default Tasks