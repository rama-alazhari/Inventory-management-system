import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Invoices = () => {
  const [invoices, setinvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState([]);
  const navigate = useNavigate();

  // جلب جميع الفواتير
  useEffect(() => {
    const getinvoices = async () => {
      try {
        const res = await axios.get('http://localhost:8080/invoices');
        setinvoices(res.data);
        setFilterSearch(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getinvoices();
  }, []);

  // تصفية البحث
  useEffect(() => {
    const result = invoices.filter((row) =>
      row.invoicesName.toLowerCase().includes(search.toLowerCase())
    );
    setFilterSearch(result);
  }, [search, invoices]);

  // حذف تصنيف
  const deleteinvoices = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/invoices/${id}`);
      alert("Deleted invoices!");
      setFilterSearch(filterSearch.filter((elem) => elem._id !== id));
    } catch (error) {
      console.log("Error deleting invoices", error);
      alert("Failed to delete invoices");
    }
  };

  // إنشاء تقرير PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("invoices Report", 14, 15);
    autoTable(doc, {
      head: [["invoices Name"]],
      body: filterSearch.map((store) => [store.invoicesName]),
      startY: 20,
      theme: "grid"
    });
    doc.save("invoices_report.pdf");
  };

  // أعمدة الجدول
  const columns = [
    {
      name: "invoices Name",
      selector: (row) => row.invoicesName,
      sortable: true,
    },
    {
      cell: (invoices) =>
        <>
          <button className="btn btn-primary me-3" onClick={() => navigate(`/edit-invoices/${invoices._id}`)}><FaEdit /></button>
          <button className="btn btn-danger" onClick={() => deleteinvoices(invoices._id)}> <MdDelete /></button>
        </>


    },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3 className="text-success">List of Invoices</h3>
        <div>
          <button className="btn btn-secondary me-2 mb-2 mb-md-0" onClick={() => navigate("/add-new-invoices")}>Add New Invoices</button>
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

export default Invoices;
