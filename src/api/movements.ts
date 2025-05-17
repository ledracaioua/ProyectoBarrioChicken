import axios from 'axios';
import { InventoryMovement } from '../types';

const API_URL = 'http://localhost:5000/api/movements';

export const addMovement = (movement: Omit<InventoryMovement, 'id'>) =>
  axios.post(API_URL, movement);

export const getMovements = () =>
  axios.get(API_URL);
