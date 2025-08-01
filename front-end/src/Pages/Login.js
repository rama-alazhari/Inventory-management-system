import React, { useState } from 'react';  
import { motion } from "framer-motion";  
import { useNavigate } from "react-router-dom";  
import axios from "axios";  
import { create } from "zustand";  
import { Loader } from "lucide-react";  

export const useAuthStore = create((set) => ({  
    user: null,  
    isAuthenticated: false,  
    error: null,  
    isLoading: false,  
    isCheckingAuth: true,  
    message: null,  

    login: async (username, password) => {  
        set({ isLoading: true, error: null });  
        try {  
            const response = await axios.post(`http://localhost:8080/login`, { username, password });  
            set({  
                isAuthenticated: true,  
                user: response.data.user,  
                error: null,  
                isLoading: false,  
            });  
        } catch (error) {  
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });  
            throw error;  
        }  
    },  
}));  

const Login = () => {  
    const [username, setUsername] = useState("");  
    const [password, setPassword] = useState("");  
    const navigate = useNavigate();  
    const { login, error, isLoading } = useAuthStore();  

    const handleLogin = async (e) => {  
        e.preventDefault();  
        try {  
            await login(username, password);  
            navigate("/");  
            window.location.reload();  
        } catch (error) {  
            console.log(error);  
        }  
    };  

    return (  
        <motion.div className='container mt-5 pt-5' initial={{ opacity: 0, scale: 0.9 }}  
            animate={{ opacity: 1, scale: 1 }}  
            exit={{ opacity: 0, scale: 0.9 }}  
            transition={{ duration: 0.5 }}  
        >  
            <div className='p-5 col-md-6 m-auto' style={{ boxShadow: "1px 1px 20px 7px gray", borderRadius: "10px", margin: "auto" }}>  
                <div className='text-center'>  
                    <img   
                        src={require('../Images/Capture.png')}   
                        width="150"   
                        height="70"   
                        className="mb-4"   
                        alt="Logo"   
                    />  
                    <h2 className="mb-5">Inventory Management System</h2>  
                </div>  
                <form onSubmit={handleLogin}>  
                    <div className="mb-3">  
                        <label htmlFor="exampleInputUsername" className="form-label">User Name</label>  
                        <input   
                            type="text"   
                            className="form-control"   
                            id="exampleInputUsername"   
                            placeholder='Enter your username...'  
                            value={username}   
                            onChange={(e) => setUsername(e.target.value)}   
                        />  
                    </div>  
                    <div className="mb-3">  
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>  
                        <input   
                            type="password"   
                            className="form-control"   
                            id="exampleInputPassword1"   
                            placeholder='Enter your password...'   
                            value={password}   
                            onChange={(e) => setPassword(e.target.value)}   
                        />  
                    </div>  
                    {error && <p className='text-danger fs-5 mb-2'>{error}</p>}  
                    <button type="submit" className="btn btn-dark" disabled={isLoading}>  
                        {isLoading ? <Loader className='w-25 h-6 animate-spin mx-auto' /> : "Login"}  
                    </button>  
                </form>            
            </div>  
        </motion.div>  
    );  
}  

export default Login;  