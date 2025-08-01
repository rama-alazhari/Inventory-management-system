import axios from "axios";  
import React, { useEffect, useState } from "react";  
import { useNavigate, useParams } from "react-router-dom";  

const DetailsProduct = () => {  
    const { id } = useParams();  
    const navigate = useNavigate();

    const [product, setProduct] = useState({  
        image: null,  
        productName: "",  
        price: "",  
        serialNumber:"",
        productHistory: "",  
        category: {},  
        productEntryDate:""
    });  

    useEffect(() => {  
        axios.get(`http://localhost:8080/products/${id}`)  
            .then(res => setProduct(res.data))  
            .catch(error => console.log(error));  
    }, [id]);  

    // Format date for the product history  
    const formatDate = (date) => {  
        if (!date) return "No Date Provided";  
        return new Date(date).toLocaleDateString("en-US", {  
            year: 'numeric',  
            month: 'long',  
            day: 'numeric',  
        });  
    };  

    return (  
        <div className="container m-auto mt-5 w-75" style={{ boxShadow: "1px 1px 25px 5px gray", borderRadius: "10px" }}>  
            <div className="row p-3">  
                <div className="col text-center">  
                    <h2 className="text-start" style={{ boxShadow: "1px 1px 5px 2px gray", borderRadius: "8px" }}>  
                        <img src={`/uploads/${product.image}`} alt={product.productName} style={{ width: "10%" }} /> {product.productName}  
                    </h2>  
                    <p className="mt-3 bg-light p-3"><span className="text-success">Product category : </span> {product.category.categoryName}</p>  
                    <p className="bg-light mt-3 p-3"><span className="text-primary"> Product Price : </span> {product.price} AED</p>  
                    <p className="bg-light mt-3 p-3"><span className="text-primary"> Serial Number : </span> {product.serialNumber}</p>  
                    <p className="mt-3 bg-light p-3"><span className="text-primary">Product expiration date : </span> {formatDate(product.productHistory)}</p>  
                    <p className="mt-3 bg-light p-3"><span className="text-primary">Product Entry Date : </span> {formatDate(product.productEntryDate)}</p>  
                    <button type="button" className="btn btn-secondary w-100" onClick={() => navigate("/products")}>Back</button>
                </div>  
            </div>  
        </div>  
    );  
}  

export default DetailsProduct;  