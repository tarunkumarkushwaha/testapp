"use client"
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletetodo, modTodo } from "@/redux/todos/todoSlice";

const Todo = ({ item, i }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.data);

  const handleUpdate = () => {
    dispatch(modTodo({ id: item._id, data: text, completed: item.completed }));
    setIsEditing(false);
  };

  return (
    <div className="smooth-entry flex items-center my-5 justify-between bg-white shadow-md p-4 rounded-xl border hover:border-slate-500 hover:bg-slate-200 border-gray-300 hover:shadow-2xl transition duration-200">

      <input
        type="checkbox"
        className="w-5 h-5 text-green-500 border-2 border-gray-300 rounded-md focus:ring-green-400"
        checked={item.completed}
        onChange={(e) =>
          dispatch(modTodo({ id: item._id, data: text, completed: e.target.checked }))
        }
      />

      <p className="text-gray-500 font-semibold w-6 text-center">{i + 1}.</p>

 
      {isEditing ? (
        <input
          className="w-full bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-green-500 text-lg py-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          autoFocus
        />
      ) : (
        <p
          className={`flex-1 text-lg px-2 cursor-pointer ${
            item.completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
          onClick={() => setIsEditing(true)}
        >
          {text}
        </p>
      )}

      <button
        className="text-red-800 hover:bg-red-300 hover:font-extrabold font-bold rounded-full p-2 transition"
        onClick={() => dispatch(deletetodo(item._id))}
      >
        X
      </button>
    </div>
  );
};

export default Todo;
