// src/api/suppliers.ts

import axios from 'axios';
import { Supplier } from '../types';

const BASE_URL = 'http://localhost:5000/api/suppliers';

export const getSuppliers = () => axios.get(BASE_URL);

export const addSupplier = (data: Omit<Supplier, '_id'>) => axios.post(BASE_URL, data);

export const updateSupplier = (id: string, data: Supplier) =>
  axios.put(`${BASE_URL}/${id}`, data);

export const deleteSupplier = (id: string) => axios.delete(`${BASE_URL}/${id}`);
