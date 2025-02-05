"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch API 
export const fetchTodos = createAsyncThunk("todo/fetchTodos", async () => {
  const response = await fetch("/api/tasks");
  const data = await response.json();
  // console.log(data)
  return data;
});

// POST request
export const addTodo = createAsyncThunk("todo/addTodo", async (todo) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  return await response.json();
});

// PUT request
export const modTodo = createAsyncThunk("todo/modTodo", async ({ id, data, completed }) => {
  // console.log(data)
  const response = await fetch("/api/tasks", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, data, completed }),
  });
  return await response.json();
});

// DELETE request
export const deletetodo = createAsyncThunk("todo/deletetodo", async (id) => {
  console.log(id,"deleted")
  await fetch("/api/tasks", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return id;
});

const initialState = {
  todos: [],
  filteredTodos: [],
  status: "idle",
  error: null,
  searchQuery: "",
  filterCompleted: "all",
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    filterTodos: (state) => {
      state.filteredTodos = state.todos.filter((todo) => {
        const matchesSearch = todo.data.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesStatus =
          state.filterCompleted === "all"
            ? true
            : state.filterCompleted === "completed"
            ? todo.completed
            : !todo.completed;
        return matchesSearch && matchesStatus;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(modTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deletetodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t._id !== action.payload);
      });
  },
});

// export const {  filterTodos} = todoSlice.actions;
let todoreducer = todoSlice.reducer;


export default todoreducer