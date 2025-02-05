// "use client"

import { configureStore } from '@reduxjs/toolkit'
import todoreducer from './todos/todoSlice'

export const store = configureStore({
  reducer: {
    TODO : todoreducer}
  
})