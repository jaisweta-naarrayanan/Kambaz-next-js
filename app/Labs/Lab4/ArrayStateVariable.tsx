"use client";
import { useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function ArrayStateVariable() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <Button variant="success" onClick={addElement} className="mb-3">
        Add Element
      </Button>
      <ListGroup>
        {array.map((item, index) => (
          <ListGroup.Item 
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <span>{item}</span>
            <Button 
              variant="danger" 
              onClick={() => deleteElement(index)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
      
      
    </div>
  );
}