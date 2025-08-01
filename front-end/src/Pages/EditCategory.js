
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categoryName, setcategoryName] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State to hold error message  

    useEffect(() => {
        axios.get(`http://localhost:8080/category/${id}`)
            .then(res => {
                setcategoryName(res.data.categoryName);
            })
            .catch(error => setErrorMessage("Failed to load category data.")); // Set error message  
    }, [id]);

    const changeOnClick = (e) => {
        e.preventDefault();

        const category = { categoryName };

        axios.patch(`http://localhost:8080/category/${id}`, category)
            .then(res => {
                alert("Edited category..");
                navigate('/category');
                window.location.reload();
            })
            .catch(error => {
                setErrorMessage("Failed to edit the category."); // Set error message on failure  
                console.log(error);
            });

        // Reset error message on inputs change  
        setErrorMessage("");
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8 m-auto mt-5 p-4" style={{ boxShadow: "1px 1px 25px 5px gray", borderRadius: "10px" }}> {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage} {/* Display error message here */}
                        </div>
                    )}
                        <h2 className="text-center mb-4"> Edit Category</h2>

                        <form onSubmit={changeOnClick} encType="multipart/form-data">

                            <div className="mb-3">
                                <label htmlFor="exampleInputname" className="form-label">Category Name</label>
                                <input type="text" className="form-control" id="exampleInputname" placeholder="Enter the category name" value={categoryName} onChange={e => setcategoryName(e.target.value)} />
                            </div>


                            <div className="d-flex justify-content-between">
                                <button className='btn btn-secondary' onClick={() => navigate("/category")}>Back</button>
                                <button type="submit" className="btn btn-primary">Edit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCategory;  