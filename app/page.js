"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Todo from "@/components/Todo";
import { fetchTodos, addTodo } from "@/app/redux/todos/todoSlice";

export default function Home() {
  const [item, setItem] = useState({ data: "", completed: false });
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state) => state.TODO);

  // console.log(todos)

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleChange = (e) => {
    setItem({ data: e.target.value, completed: false });
  };

  const handleAddTodo = () => {
    if (item.data.trim() !== "") {
      dispatch(addTodo(item));
      setItem({ data: "", completed: false });
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTodo();
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-cyan-200 p-4">

        <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl bg-white shadow-xl p-4 rounded-lg">
          <p className="text-gray-600 font-medium">
            <span className="text-green-700">Completed:</span> {todos.filter((t) => t.completed).length}
          </p>
          <p className="text-gray-600 font-medium">
            <span className="text-orange-700">Uncompleted:</span> {todos.length - todos.filter((t) => t.completed).length}
          </p>
          <p className="text-gray-600 font-medium"> <span className="text-violet-700">Total:</span> {todos.length}</p>
        </div>


        <div className="flex w-full max-w-3xl mt-6 gap-2">
            <input
              type="text"
              value={item.data}
              onChange={handleChange}
              onKeyDown={handleEnterPress}
              placeholder="Enter your task..."
              className="outline-none ps-5 w-full bg-white shadow-xl p-4 rounded-lg"
            />
          <button
            className="bg-green-500 text-white px-4 py-1 outline-none rounded-lg shadow-xl hover:bg-green-700 transition"
            onClick={handleAddTodo}
          >
            Add
          </button>
        </div>

        {status === "loading" && <p className="text-gray-500 mt-4">Loading tasks...</p>}
        {status === "failed" && <p className="text-red-500 mt-4">Error loading tasks.</p>}

        <div className="w-full max-w-3xl mt-6 bg-white shadow-lg p-4 rounded-lg">
          {todos.length > 0 ? (
            todos.map((task, index) => <Todo key={index} item={task} i={index} />)
          ) : (
            <p className="text-gray-500 text-center">No tasks available.</p>
          )}
        </div>
      </div>
    </>
  );
}