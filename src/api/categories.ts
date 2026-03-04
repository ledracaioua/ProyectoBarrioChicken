import axios from 'axios';

const BASE_URL = 'https://proyectobarriochicken.onrender.com/api/categories';

export const getCategories = () => axios.get<string[]>(BASE_URL);
