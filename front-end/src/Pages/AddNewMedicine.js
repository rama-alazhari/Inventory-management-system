import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const AddNewMedicine = () => {

    const [drugName, setdrugName] = useState("");
    const [companyName, setcompanyName] = useState("");
    const [dosage, setDosage] = useState("");
    const [typeofDrug, setTypeofDrug] = useState("");
    const [dateofProced, setDateofProced] = useState("");
    const [dateofExpired, setDateofExpired] = useState("");
    const [error, setError] = useState("");  

    const navigate = useNavigate();

    ///////////Add new medicine////////////////////////////////////
    const addmedicine = async (e) => {  
        e.preventDefault();  
        setError(""); // Clear previous errors  

      
        // Validate input fields  
        if (!drugName && !companyName) {  
            setError("Both medicine name and companyName are required.");  
            return;  
        }  
        
        if (!drugName) {  
            setError("medicine name is required.");  
            return;  
        }  

        if (!companyName) {  
            setError("companyName is required.");  
            return;  
        }  

        try {  
            await axios.post('http://localhost:8080/medicine', {  
                drugName,  
                companyName,  
                dosage,
                typeofDrug,
                dateofProced,
                dateofExpired
            });  
            alert("The medicine has been added successfully!");  
            navigate('/medicine');  
            window.companyName.reload();  
        } catch (error) {  
            if (error.response && error.response.data) {  
                setError(error.response.data.message || "Something went wrong.");  
            } else {  
                setError("Unable to add the medicine. Please try again later.");  
            }  
        }  
    };  

    return (

        <div className="container">
            <div className="row">
                <div className="col-12 col-md-8 m-auto mt-5 p-4 shadow-lg rounded">
                <h2 className="text-center mb-4"> Add New Medicine</h2>
                    <form>
                        <div className="mb-3">
                            <label for="exampleInputname" className="form-label">medicine Name</label>
                            <input type="text" className="form-control" id="exampleInputname" placeholder="Enter the medicine name" value={drugName} onChange={e => setdrugName(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label for="exampleInputcompanyName1" className="form-label">medicine companyName</label>
                            <input type="text" className="form-control" id="exampleInputcompanyName1" value={companyName} placeholder="Enter the site" onChange={e => setcompanyName(e.target.value)} />
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}  
                        <div className="d-flex justify-content-between">
                            <button className='btn btn-secondary' onClick={()=> navigate("/medicine") }>Back</button>
                            <button type="submit" className="btn btn-primary" onClick={addmedicine}>Add Medicine</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddNewMedicine
