import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Category = () => {
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState("");
    const [filterSearch, setFilterSearch] = useState([]);
    const navigate = useNavigate();

    // جلب جميع التصنيفات
    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await axios.get('http://localhost:8080/category');
                setCategory(res.data);
                setFilterSearch(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getCategory();
    }, []);

    // تصفية البحث
    useEffect(() => {
        const result = category.filter((row) =>
            row.categoryName.toLowerCase().includes(search.toLowerCase())
        );
        setFilterSearch(result);
    }, [search, category]);

    // حذف تصنيف
    const deleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/category/${id}`);
            alert("Deleted category!");
            setFilterSearch(filterSearch.filter((elem) => elem._id !== id));
        } catch (error) {
            console.log("Error deleting category", error);
            alert("Failed to delete category");
        }
    };

    // إنشاء تقرير PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Category Report", 14, 15);
        autoTable(doc, {
            head: [["Category Name"]],
            body: filterSearch.map((store) => [store.categoryName]),
            startY: 20,
            theme: "grid"
        });
        doc.save("category_report.pdf");
    };

    // أعمدة الجدول
    const columns = [
        {
            name: "Category Name",
            selector: (row) => row.categoryName,
            sortable: true,
        },
        {
            cell: (category) => 
                <>
                    <button className="btn btn-primary me-3" onClick={() => navigate(`/editcategory/${category._id}`)}><FaEdit /></button>
                    <button className="btn btn-danger" onClick={() => deleteCategory(category._id)}> <MdDelete /></button>
                </>
            
           
        },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="text-success">List of Categories</h3>
                <div>
                    <button className="btn btn-secondary me-2 mb-2 mb-md-0" onClick={() => navigate("/addnewcategory")}>Add New Category</button>
                    <button className="btn btn-success" onClick={generatePDF}>🖨 Print Report</button>
                </div>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <DataTable
                    columns={columns}
                    data={filterSearch}
                    selectableRows
                    highlightOnHover
                    fixedHeader
                    pagination
                    customStyles={{
                        headRow: { style: { backgroundColor: "#28a745", color: "#fff" } },
                    }}
                />
            </div>
        </div>
    );
};

export default Category;
