import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const AddNewCategory = () => {

    const [categoryName, setcategoryName] = useState("");
    const [error, setError] = useState("");  

    const navigate = useNavigate();

    ///////////Add new category////////////////////////////////////
    const addcategory = async (e) => {  
        e.preventDefault();  
        setError(""); // Clear previous errors  

      
        // Validate input fields  
        if (!categoryName) {  
            setError("Category Name is required.");  
            return;  
        }  

        try {  
            await axios.post('http://localhost:8080/category', {  
                categoryName,  
            });  
            alert("The category has been added successfully!");  
            navigate('/category');  
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
                <div className="col-12 col-md-8 col-lg-6 mt-5 p-4 shadow-lg rounded bg-white m-auto" >
                <h2 className="text-center mb-4"> Add New Category</h2>
                    <form>
                        <div className="mb-3">
                            <label for="exampleInputname" className="form-label">Category Name</label>
                            <input type="text" className="form-control" id="exampleInputname" placeholder="Enter the category name" value={categoryName} onChange={e => setcategoryName(e.target.value)} />
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}  

                        <div className="d-flex justify-content-between">
                            <button className='btn btn-secondary' onClick={()=> navigate("/category") }>Back</button>
                            <button type="submit" className="btn btn-primary" onClick={addcategory}>Add category</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddNewCategory
