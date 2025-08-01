import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
   const { id } = useParams();
   const navigate = useNavigate();

  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");  

   useEffect(() => {
        axios.get(`http://localhost:8080/users/${id}`)
            .then(res => {
              setusername(res.data.username);
              setEmail(res.data.email);
              setpassword(res.data.password);
            })
            .catch(error => setError("Failed to load user data.")); // Set error message  
    }, [id]);

  ///////////edit user////////////////////////////////////
 const editUser = (e) => {
        e.preventDefault();

        const user = { username, password  ,email};

        axios.patch(`http://localhost:8080/users/${id}`, user)
            .then(res => {
                alert("Edited user..");
                navigate('/employee');
                window.location.reload();
            })
            .catch(error => {
              setError("Failed to edit the user."); // Set error message on failure  
                console.log(error);
            });

        // Reset error message on inputs change  
        setError("");
    };


  return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 mt-5 p-4 shadow-lg rounded bg-white">
                <h2 className="text-center mb-4"> Edit User</h2>

                <form onSubmit={editUser}>
                    {/* user name */}
                    <div className="mb-3">
                        <label className="form-label">User Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter product name"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
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
                           Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
}

export default EditUser
