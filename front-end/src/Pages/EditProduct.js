import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [productHistory, setProductHistory] = useState("");
    const [category, setCategory] = useState(""); // إضافة حقل الصنف
    const [categories, setCategories] = useState([]); // قائمة الأصناف
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/products/${id}`)
            .then(res => {
                setImage(res.data.image);
                setProductName(res.data.productName);
                setPrice(res.data.price);
                setSerialNumber(res.data.serialNumber);
                setProductHistory(res.data.productHistory);
                setCategory(res.data.category);
            })
            .catch(error => setError("Failed to load product data.")); // Set error message  
    }, [id]);

    useEffect(() => {
        // جلب قائمة الأصناف عند تحميل الصفحة
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8080/category");
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const onChangeFile = (e) => {
        setImage(e.target.files[0]);
    };

    const addProduct = async (e) => {
        e.preventDefault();
        setError("");

        const formData = new FormData();
        formData.append("image", image);
        formData.append("productName", productName);
        formData.append("price", price);
        formData.append("serialNumber", serialNumber);
        formData.append("productHistory", productHistory);
        formData.append("category", category);

        try {
            await axios.patch(`http://localhost:8080/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("The product was edited successfully!");
            navigate("/products");
        } catch (error) {
            setError(error.response?.data?.message || "حدث خطأ أثناء تعديل المنتج.");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 mt-5 p-4 shadow-lg rounded bg-white">
                    <h2 className="text-center mb-4"> Edit Product</h2>

                    <form onSubmit={addProduct}>
                        {/* اسم المنتج */}
                        <div className="mb-3">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter product name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>

                        {/* سعر المنتج */}
                        <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        {/* رقم المنتج */}
                        <div className="mb-3">
                            <label className="form-label">Serial Number</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter serial number"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                            />
                        </div>

                        {/* تاريخ المنتج */}
                        <div className="mb-3">
                            <label className="form-label">Product expiration date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={productHistory}
                                onChange={(e) => setProductHistory(e.target.value)}
                            />
                        </div>

                        {/* اختيار الفئة */}
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select the item</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* تحميل الصورة */}
                        <div className="mb-3">
                            <label className="form-label">Product Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={onChangeFile}
                            />
                        </div>

                        {/* عرض الأخطاء إن وجدت */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* الأزرار */}
                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/products")}>
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
};

export default EditProduct;
