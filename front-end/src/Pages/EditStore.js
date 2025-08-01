import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditStore = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [storename, setstorename] = useState("");
    const [location, setlocation] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State to hold error message  

    useEffect(() => {
        axios.get(`http://localhost:8080/store/${id}`)
            .then(res => {
                setstorename(res.data.storename);
                setlocation(res.data.location);
            })
            .catch(error => setErrorMessage("Failed to load store data.")); // Set error message  
    }, [id]);

    const changeOnClick = (e) => {
        e.preventDefault();

        const store = { storename, location };

        axios.patch(`http://localhost:8080/store/${id}`, store)
            .then(res => {
                alert("Edited Store..");
                navigate('/store');
                window.location.reload();
            })
            .catch(error => {
                setErrorMessage("Failed to edit the store."); // Set error message on failure  
                console.log(error);
            });

        // Reset error message on inputs change  
        setErrorMessage("");
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8 m-auto mt-5 p-4" style={{ boxShadow: "1px 1px 25px 5px gray", borderRadius: "10px" }}>                        {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage} {/* Display error message here */}
                        </div>
                    )}

                        <h2 className="text-center mb-4"> Edit Store</h2>

                        <form onSubmit={changeOnClick} encType="multipart/form-data">

                            <div className="mb-3">
                                <label htmlFor="exampleInputname" className="form-label">Store Name</label>
                                <input type="text" className="form-control" id="exampleInputname" placeholder="Enter the store name" value={storename} onChange={e => setstorename(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="exampleInputlocation1" className="form-label">Store Location</label>
                                <input type="text" className="form-control" id="exampleInputlocation1" value={location} placeholder="Enter the site" onChange={e => setlocation(e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-between">
                                <button className='btn btn-secondary' onClick={() => navigate("/store")}>Back</button>
                                <button type="submit" className="btn btn-primary">Edit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditStore;  