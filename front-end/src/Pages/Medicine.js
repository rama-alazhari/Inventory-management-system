import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Medicine = () => {
    const [medicine, setmedicine] = useState([]);
    const [search, setSearch] = useState("");
    const [filterSearch, setFilterSearch] = useState([]);
    const navigate = useNavigate();

    // جلب جميع الادوية
    useEffect(() => {
        const getmedicine = async () => {
            try {
                const res = await axios.get('http://localhost:8080/medicine');
                setmedicine(res.data);
                setFilterSearch(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getmedicine();
    }, []);

    // تصفية البحث
    useEffect(() => {
        const result = medicine.filter((row) =>
            row.medicineName.toLowerCase().includes(search.toLowerCase())
        );
        setFilterSearch(result);
    }, [search, medicine]);

    // حذف تصنيف
    const deletemedicine = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/medicine/${id}`);
            alert("Deleted medicine!");
            setFilterSearch(filterSearch.filter((elem) => elem._id !== id));
        } catch (error) {
            console.log("Error deleting medicine", error);
            alert("Failed to delete medicine");
        }
    };

    // إنشاء تقرير PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("medicine Report", 14, 15);
        autoTable(doc, {
            head: [["medicine Name"]],
            body: filterSearch.map((store) => [store.medicineName]),
            startY: 20,
            theme: "grid"
        });
        doc.save("medicine_report.pdf");
    };

    // أعمدة الجدول
    const columns = [
        {
            name: "medicine Name",
            selector: (row) => row.medicineName,
            sortable: true,
        },
        {
            cell: (medicine) => 
                <>
                    <button className="btn btn-primary me-3" onClick={() => navigate(`/edit-medicine/${medicine._id}`)}><FaEdit /></button>
                    <button className="btn btn-danger" onClick={() => deletemedicine(medicine._id)}> <MdDelete /></button>
                </>
            
           
        },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="text-success">List of Medicine</h3>
                <div>
                    <button className="btn btn-secondary me-2 mb-2 mb-md-0" onClick={() => navigate("/add-new-medicine")}>Add New Medicine</button>
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

export default Medicine;
