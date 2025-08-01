import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`http://localhost:8080/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const token = localStorage.getItem("token"); // أو أينما خزنت التوكن  
			const response = await axios.get(`http://localhost:8080/check-auth ` ,  {  
				headers: {  
					Authorization: `Bearer ${token}`   
				}  
			});
			console.log("User data:", response.data.user); // تحقق من البيانات  
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			console.error("Auth error:", error); 
			set({ error: null, isCheckingAuth: false, isAuthenticated: false , user: null });
		}
	},
	
}));
