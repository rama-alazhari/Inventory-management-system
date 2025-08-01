import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


const Store = () => {
    const [store, setStore] = useState([]);
    const [search, setSearch] = useState("");
    const [filterSearch, setFilterSearch] = useState([]);

    const navigate = useNavigate();

    // جلب جميع المخازن من قاعدة البيانات
    const getStore = async () => {
        try {
            const res = await axios.get('http://localhost:8080/store');
            setStore(res.data);
            setFilterSearch(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // حذف المخزن
    const deleteStore = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/store/${id}`);
            alert("Deleted store!");
            setFilterSearch(filterSearch.filter(elem => elem._id !== id));
        } catch (error) {
            console.log("Error deleting store", error);
            alert("Failed to delete store");
        }
    };

    // دالة إنشاء تقرير PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Store Report", 14, 15);

        const tableColumn = ["Store Name", "Location"];
        const tableRows = [];

        filterSearch.forEach(store => {
            const storeData = [
                store.storename,
                store.location
            ];
            tableRows.push(storeData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save("store_report.pdf");
    };

    // تعريف الأعمدة الخاصة بالجدول
    const columns = [
        {
            name: 'Store Name',
            selector: (row) => row.storename,
            sortable: true
        },
        {
            name: 'Location',
            selector: (row) => row.location,
            sortable: true
        },
        {
            name: "Display Products",
            cell: (store) =>
                <button className="btn btn-primary" onClick={() => navigate(`/store/${store._id}/inventory`)}>
                    View
                </button>
        },
        {
            cell: (store) =>
                <>
                    <button className="btn btn-primary me-3" onClick={() => navigate(`/editstore/${store._id}`)}><FaEdit /></button>
                    <button className="btn btn-danger" onClick={() => deleteStore(store._id)}><MdDelete /></button>
                </>
        },
    ];

    useEffect(() => {
        getStore();
    }, []);

    useEffect(() => {
        const result = store.filter((row) => {
            return row.storename.toLowerCase().includes(search.toLowerCase());
        });
        setFilterSearch(result);
    }, [search, store]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="text-success">List of Stores</h3>
                <div>
                    <button className="btn btn-secondary me-2 mb-2 mb-md-0" onClick={() => navigate("/addnewstore")}>Add New Store</button>
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

export default Store;
