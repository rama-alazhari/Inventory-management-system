import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddImportExport = () => {
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedStore, setSelectedStore] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        storeId: "",
        productId: "",
        inputOrOutput: "Import",
        quantity: 0,
        refNumber: "",
        placeProduct: "",
        note: "",
    });

    useEffect(() => {
        axios.get("http://localhost:8080/store").then(res => setStores(res.data));
        axios.get("http://localhost:8080/products").then(res => setProducts(res.data));
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStoreChange = (e) => {
        setSelectedStore(e.target.value);
        setFormData({ ...formData, storeId: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/import-export", formData);
            alert("Transaction recorded successfully");
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 mt-5 p-4 shadow-lg rounded bg-white">
                    <h2 className="text-center mb-4">Import / Export Products</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Store</label>
                            <select name="storeId" className="form-control" onChange={handleStoreChange}>
                                <option value="">Select Store</option>
                                {stores.map(store => (
                                    <option key={store._id} value={store._id}>{store.storename}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>Product</label>
                            <select name="productId" className="form-control" onChange={handleChange}>
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product._id} value={product._id}>{product.productName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>Type</label>
                            <select name="inputOrOutput" className="form-control" onChange={handleChange}>
                                <option value="Import">Import</option>
                                <option value="Export">Export</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>Quantity</label>
                            <input type="number" name="quantity" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label>Ref Number</label>
                            <input type="number" name="refNumber" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label>Place Product</label>
                            <input type="text" name="placeProduct" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label>Note</label>
                            <input type="text" name="note" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="d-flex justify-content-between">
                            <button className='btn btn-secondary' onClick={()=> navigate("/importandexport") }>Back</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};



export default AddImportExport;
