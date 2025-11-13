import apiClient from './apiService';

export const userService = {

    getUserById: async (id) => {
        return apiClient.get(`/users/${id}`);
    }

}