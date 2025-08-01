import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ImportAndExport = () => {
    const [importExport, setImportExport] = useState([]);
    const [search, setSearch] = useState("");
    const [filterSearch, setFilterSearch] = useState([]);
    const [operationType, setOperationType] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

    const getImportExport = async () => {
        try {
            const res = await axios.get('http://localhost:8080/import-export');
            setImportExport(res.data);
            setFilterSearch(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteImportExport = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/import-export/${id}`);
            alert("Deleted successfully!");
            setFilterSearch(filterSearch.filter(elem => elem._id !== id));
        } catch (error) {
            console.log("Error deleting importExport", error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Product Input and Output Report", 14, 15);

        const tableColumn = ["Product Name", "Store Name", "Type of operation", "Quantity", "Ref Number", "Place Product", "Note", "Date of Entry/Exit"];
        const tableRows = [];

        filterSearch.forEach(importExport => {
            const productName = importExport.productId && importExport.productId.productName ? importExport.productId.productName : "Product not found";  
            const storeName = importExport.storeId ? importExport.storeId.storename : "Store not found";  
    
            const importExportData = [
                productName,
                storeName,
                importExport.inputOrOutput,
                importExport.quantity,
                importExport.refNumber,
                importExport.placeProduct,
                importExport.note,
                new Date(importExport.productEntryOutDate).toLocaleString('en-US', { timeZone: 'Asia/Dubai' })
            ];
            tableRows.push(importExportData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save("importExport_report.pdf");
    };

    const applyFilters = () => {
        let filteredData = importExport;

        // 🔹 فلترة حسب نوع العملية (Import / Export)
        if (operationType !== "All") {
            filteredData = filteredData.filter(row => row.inputOrOutput === operationType);
        }

        // 🔹 فلترة حسب نطاق التاريخ
        if (startDate && endDate) {
            filteredData = filteredData.filter(row => {
                const entryDate = new Date(row.productEntryOutDate);
                return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
            });
        }

        // 🔹 فلترة حسب البحث في اسم المنتج
        filteredData = filteredData.filter(row => {  
            const productName = row.productId && row.productId.productName ? row.productId.productName.toLowerCase() : '';  
            return productName.includes(search.toLowerCase());  
        });  
        
        setFilterSearch(filteredData);
    };

    useEffect(() => {
        getImportExport();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [search, operationType, startDate, endDate, importExport]);

    const columns = [
        {
            name: 'Product Name',
            selector: (row) => (row.productId && row.productId.productName) ? row.productId.productName : "Product not found",  
            sortable: true
        },
        {
            name: 'Store Name',
            selector: (row) => (row.storeId && row.storeId.storename) ? row.storeId.storename : "Store not found",  
            sortable: true
        },
        {
            name: 'Type of operation',
            selector: (row) => row.inputOrOutput,
            sortable: true
        },
        {
            name: 'Quantity',
            selector: (row) => row.quantity,
            sortable: true
        },
        {
            name: 'Date of Entry/Directing',
            selector: (row) => new Date(row.productEntryOutDate).toLocaleDateString(),
            sortable: true
        },
        {
            name: "Actions",
            cell: (importExport) => <>
                <button className="btn btn-secondary me-2" onClick={() => navigate(`/details-import-export/${importExport._id}`)}><FcViewDetails />  </button>
                {/* <button className="btn btn-primary me-2" onClick={() => navigate(`/edit-import-export/${importExport._id}`)}><FaEdit /></button> */}
                <button className="btn btn-danger" onClick={() => deleteImportExport(importExport._id)}><MdDelete /></button>
            </>

        },
    ];

    return (

        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="text-success">List of Import/Export products</h3>
                <div>
                    <button className="btn btn-secondary me-2 mb-2 mb-md-0" onClick={() => navigate("/add-import-export")}>Add New Import/Export</button>
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

            {/* 🔹 الفلاتر الجديدة */}
            <div className="d-flex gap-2 mb-3">
                <select className="form-select w-auto" value={operationType} onChange={(e) => setOperationType(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Import">Import</option>
                    <option value="Export">Export</option>
                </select>
                <span>From :</span>
                <input type="date" className="form-control w-auto" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span>To :</span>
                <input type="date" className="form-control w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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

export default ImportAndExport;
