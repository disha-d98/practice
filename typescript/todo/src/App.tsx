import { useState, type JSX } from 'react'
import './App.css'

interface ToDoItem {
  id: number,
  text: string,
  done: boolean
}

function App(): JSX.Element {
  const [toDos, setToDos] = useState<ToDoItem[]>([])
  const count: number = toDos.length
  const completedTodos = toDos.filter(todo => todo.done)

  function addToDo(){    
    const input: string = (document.getElementById('input') as HTMLInputElement)?.value ?? "";
    const newToDo: ToDoItem = {
      id: count + 1,
      text: input,
      done: false
      }
    setToDos([...toDos, newToDo])
  }

  const deleteItem = (item: ToDoItem): void => {
    setToDos((toDos) => toDos.filter((toDo) => toDo.id !== item.id))
  }

  const markDone = (task: ToDoItem): void => {
    setToDos((toDos) =>
      toDos.map((toDo) =>
        toDo.id === task.id ? { ...toDo, done: !toDo.done } : toDo
      )
    );
    
  }

  return (
    <>
      <h1>TODO</h1>
      <input type='text' placeholder='Enter To Do item' id='input'/>
      <button onClick={addToDo}>Add</button>
      
      <h4>Your Tasks</h4>
      {toDos.map((item: ToDoItem, idx: number) => <ToDoItem item={item} markDone={markDone} isEven={idx%2 === 0}/>)}

      <h4>Done Tasks</h4>
      {completedTodos.map((item: ToDoItem) => <ToDoItem item={item} deleteItem={deleteItem} />)}
    </>
  )
}

function ToDoItem(props: { item: ToDoItem, isEven?: boolean, deleteItem?: (item: ToDoItem) => void, markDone?: (item: ToDoItem) => void}): JSX.Element {

  const { item, isEven, deleteItem, markDone } = props

  return <div className={isEven ? 'even' : ''}>
    {item.text}
    {typeof deleteItem === "function" && <button onClick={_ => deleteItem?.(item)}>delete</button>}
    {typeof markDone === "function" && <button onClick={_ => markDone?.(item)}>Done</button>}
  </div>
}

export default App
