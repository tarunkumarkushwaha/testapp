"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "tasks";

const getLocalTodos = () => {
  const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const saveLocalTodos = (todos) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
};

// Fetch API 
export const fetchTodos = createAsyncThunk("todo/fetchTodos", async () => {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) throw new Error("API failed");
    const data = await response.json();
    saveLocalTodos(data); 
    return data;
  } catch (error) {
    return getLocalTodos(); 
  }
});

// POST
export const addTodo = createAsyncThunk("todo/addTodo", async (todo) => {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error("API failed");
    const newTodo = await response.json();
    const updatedTodos = [...getLocalTodos(), newTodo];
    saveLocalTodos(updatedTodos);
    return newTodo;
  } catch (error) {
    const localTodo = { ...todo, _id: Date.now().toString() }; 
    const updatedTodos = [...getLocalTodos(), localTodo];
    saveLocalTodos(updatedTodos);
    return localTodo;
  }
});

// PUT
export const modTodo = createAsyncThunk("todo/modTodo", async ({ id, data, completed }) => {
  try {
    const response = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data, completed }),
    });
    if (!response.ok) throw new Error("API failed");
    const updatedTodo = await response.json();
    
    const updatedTodos = getLocalTodos().map((todo) =>
      todo._id === id ? updatedTodo : todo
    );
    saveLocalTodos(updatedTodos);
    return updatedTodo;
  } catch (error) {
    const updatedTodos = getLocalTodos().map((todo) =>
      todo._id === id ? { ...todo, data, completed } : todo
    );
    saveLocalTodos(updatedTodos);
    return { id, data, completed };
  }
});

// DELETE
export const deletetodo = createAsyncThunk("todo/deletetodo", async (id) => {
  try {
    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("API failed");

    const updatedTodos = getLocalTodos().filter((todo) => todo._id !== id);
    saveLocalTodos(updatedTodos);
    return id;
  } catch (error) {
    const updatedTodos = getLocalTodos().filter((todo) => todo._id !== id);
    saveLocalTodos(updatedTodos);
    return id;
  }
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

// export const { filterTodos } = todoSlice.actions;

let todoreducer = todoSlice.reducer;


export default todoreducer