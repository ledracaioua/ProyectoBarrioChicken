import axios from 'axios';
import { InventoryMovement } from '../types';

const API_URL = 'https://proyectobarriochicken.onrender.com/api/movements';

export const addMovement = (movement: Omit<InventoryMovement, 'id'>) =>
  axios.post(API_URL, movement);

export const getMovements = () =>
  axios.get(API_URL);
