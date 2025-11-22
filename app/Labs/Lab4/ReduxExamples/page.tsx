"use client";
import HelloRedux from "./HelloRedux/index";
import CounterRedux from "./CounterRedux/index";
import AddRedux from "./AddRedux";
import TodoList from "./todos/TodoList";

export default function ReduxExamples() {
  return(
    <div>
      <h2>Redux Examples</h2>
      <HelloRedux /> 
      <CounterRedux />
      <AddRedux />
      <TodoList />
    </div>
  );
};

