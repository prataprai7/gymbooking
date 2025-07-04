import axios from "axios";

const API = "http://localhost:5173/api/users";

export const getUsers = () => axios.get(API);
export const getUserById = (id) => axios.get(`${API}/${id}`);
export const createUser = (user) => axios.post(API, user);
export const updateUser = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API}/${id}`);