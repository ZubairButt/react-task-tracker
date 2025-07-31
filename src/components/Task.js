import {FaTimes} from 'react-icons/fa';

function Task({task, onDelete, onToggle}) {
  return (
    <div 
      className={`task ${task.reminder ? 'reminder' : ''}`} 
      onDoubleClick={() => onToggle && onToggle(task.id)}
    >
        <h3>{task.text}
        <FaTimes style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDelete(task.id)}/></h3>
        <p>{task.day}</p>
        {task.reminder && <p style={{ fontSize: '12px', color: '#5cb85c' }}>🔔 Reminder set</p>}
    </div>
  )
}

export default Task