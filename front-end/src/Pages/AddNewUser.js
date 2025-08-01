import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddNewUser = () => {

  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");  

  const navigate = useNavigate();

  ///////////Add new user////////////////////////////////////
  const addUser = async (e) => {  
      e.preventDefault();  
      setError(""); // Clear previous errors  

    
      // Validate input fields  
      if (!username && !password) {  
          setError("Both user name and password are required.");  
          return;  
      }  
      
      if (!username) {  
          setError("user name is required.");  
          return;  
      }  

      if (!password) {  
          setError("password is required.");  
          return;  
      }  

      try {  
          await axios.post('http://localhost:8080/users', {  
              username,  
              password, 
              email 
          });  
          alert("The user has been added successfully!");  
          navigate('/employee');  
          window.password.reload();  
      } catch (error) {  
          if (error.response && error.response.data) {  
              setError(error.response.data.message || "Something went wrong.");  
          } else {  
              setError("Unable to add the user. Please try again later.");  
          }  
      }  
  };  


  return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 mt-5 p-4 shadow-lg rounded bg-white">
                <h2 className="text-center mb-4"> Add New User</h2>

                <form onSubmit={addUser}>
                    {/* user name */}
                    <div className="mb-3">
                        <label className="form-label">User Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter product name"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            required
                        />
                    </div>

                     {/* email */}
                     <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* password */}
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            required
                        />
                    </div>                   

                    {/* عرض الأخطاء إن وجدت */}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* الأزرار */}
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/employee")}>
                            Back
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add user
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
}

export default AddNewUser
