import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailsImportExport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        productId: {},
        storeId: {},
        inputOrOutput: "",
        quantity: "",
        refNumber: "",
        placeProduct: "",
        note: "",
        productEntryOutDate: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:8080/import-export/${id}`)
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
                <div className="col-12 col-md-6">
                    <p className="mt-3 bg-light p-3"><span className="text-primary">Product Name : </span> {product.productId.productName}</p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="mt-3 bg-light p-3"><span className="text-primary">Store Name : </span> {product.storeId.storename}</p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="mt-3 bg-light p-3"><span className="text-primary">Type of operation : </span> {product.inputOrOutput}</p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="bg-light mt-3 p-3"><span className="text-primary"> Quantity : </span> {product.quantity} </p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="bg-light mt-3 p-3"><span className="text-primary"> Ref Number : </span> {product.refNumber} </p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="bg-light mt-3 p-3"><span className="text-primary"> Place Product : </span> {product.placeProduct} </p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="bg-light mt-3 p-3"><span className="text-primary"> Note : </span> {product.note} </p>
                    </div>
                    <div className="col-12 col-md-6">
                    <p className="mt-3 bg-light p-3"><span className="text-primary">Product Entry Date : </span> {formatDate(product.productEntryOutDate)}</p>
                    </div>
                    <button type="button" className="btn btn-secondary w-100" onClick={() => navigate("/importandexport")}>Back</button>
                
            </div>
        </div>
    );
}

export default DetailsImportExport;  