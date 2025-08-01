import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const AddNewStore = () => {

    const [storename, setStoreName] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");  

    const navigate = useNavigate();

    ///////////Add new store////////////////////////////////////
    const addStore = async (e) => {  
        e.preventDefault();  
        setError(""); // Clear previous errors  

      
        // Validate input fields  
        if (!storename && !location) {  
            setError("Both store name and location are required.");  
            return;  
        }  
        
        if (!storename) {  
            setError("Store name is required.");  
            return;  
        }  

        if (!location) {  
            setError("Location is required.");  
            return;  
        }  

        try {  
            await axios.post('http://localhost:8080/store', {  
                storename,  
                location,  
            });  
            alert("The store has been added successfully!");  
            navigate('/store');  
            window.location.reload();  
        } catch (error) {  
            if (error.response && error.response.data) {  
                setError(error.response.data.message || "Something went wrong.");  
            } else {  
                setError("Unable to add the store. Please try again later.");  
            }  
        }  
    };  

    return (

        <div className="container">
            <div className="row">
                <div className="col-12 col-md-8 m-auto mt-5 p-4" style={{ boxShadow: "1px 1px 25px 5px gray", borderRadius: "10px" }}>
                <h2 className="text-center mb-4"> Add New Store</h2>
                    <form>
                        <div className="mb-3">
                            <label for="exampleInputname" className="form-label">Store Name</label>
                            <input type="text" className="form-control" id="exampleInputname" placeholder="Enter the store name" value={storename} onChange={e => setStoreName(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label for="exampleInputlocation1" className="form-label">Store Location</label>
                            <input type="text" className="form-control" id="exampleInputlocation1" value={location} placeholder="Enter the site" onChange={e => setLocation(e.target.value)} />
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}  
                        <div className="d-flex justify-content-between">
                            <button className='btn btn-secondary' onClick={()=> navigate("/store") }>Back</button>
                            <button type="submit" className="btn btn-primary" onClick={addStore}>Add store</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddNewStore
