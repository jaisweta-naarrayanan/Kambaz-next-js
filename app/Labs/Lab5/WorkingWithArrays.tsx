"use client";
import React, {useState} from "react";
import FormControl from "react-bootstrap/esm/FormControl";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({ 
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });
  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos </a><hr/>
        <h4>Retrieving an Item from an Array by ID</h4>
      <a id="wd-retrieve-todo-by-id" className="btn btn-primary float-end" href={`${API}/${todo.id}`}>
        Get Todo by ID
      </a>
      <FormControl id="wd-todo-id" defaultValue={todo.id} className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
      <hr />
      <h3>Filtering Array Items</h3>
      <a id="wd-retrieve-completed-todos" className="btn btn-primary"
        href={`${API}?completed=true`}>
        Get Completed Todos
      </a><hr/>
      <h3>Creating new Items in an Array</h3>
      <a id="wd-create-todo" className="btn btn-primary"
        href={`${API}/create`}>
        Create Todo
      </a><hr/>
      <h3>Removing from an Array</h3>
      <a id="wd-remove-todo" className="btn btn-primary float-end" href={`${API}/${todo.id}/delete`}>
        Remove Todo with ID = {todo.id} </a>
      <FormControl defaultValue={todo.id} className="w-50" onChange={(e) => setTodo({ ...todo, id: e.target.value })}/><hr/>
      <h3>Updating an Item in an Array</h3>
      <a href={`${API}/${todo.id}/title/${todo.title}`} className="btn btn-primary float-end">
        Update Todo</a>
      <FormControl defaultValue={todo.id} className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
      <FormControl defaultValue={todo.title} className="w-50 float-start me-2"
             onChange={(e) => setTodo({ ...todo, title: e.target.value }) }/>
      {/* Edit description */}
      <FormControl
        type="text"
        className="w-50 float-start me-2 mt-2"
        placeholder="Description"
        value={todo.description}
        onChange={e => setTodo({ ...todo, description: e.target.value })}
      />
      <a
        href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`}
        className="btn btn-info float-start me-2 mt-2"
        id="wd-update-todo-description"
      >
        Update Description
      </a>
      {/* Edit completed */}
      <div className="form-check float-start ms-2 mt-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="wd-todo-completed"
          checked={todo.completed}
          onChange={e => setTodo({ ...todo, completed: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="wd-todo-completed">Completed</label>
      </div>
      <a
        href={`${API}/${todo.id}/completed/${todo.completed}`}
        className="btn btn-warning float-start ms-2 mt-2"
        id="wd-update-todo-completed"
      >
        Update Completed
      </a>
      <br /><br /><hr />

    </div>
  );
}