import axios from 'axios';
import { Order } from '../types';

const BASE = 'http://localhost:5000/api/orders';

export const getOrders   = ()                     => axios.get(BASE);
export const addOrder    = (o: Omit<Order,'_id'>) => axios.post(BASE, o);
export const updateOrder = (id: string, o: Partial<Order>) =>
  axios.put(`${BASE}/${id}`, o);
export const deleteOrder = (id: string)           => axios.delete(`${BASE}/${id}`);
