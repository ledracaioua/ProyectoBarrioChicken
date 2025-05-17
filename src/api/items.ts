// src/api/items.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

export const getItems = () => axios.get(API_URL);
export const addItem = (item: any) => axios.post(API_URL, item);
export const updateItem = (id: string, item: any) => axios.put(`${API_URL}/${id}`, item);
export const deleteItem = (id: string) => axios.delete(`${API_URL}/${id}`);
