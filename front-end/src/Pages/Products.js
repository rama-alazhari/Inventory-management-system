import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Products = () => {
    const [product, setProduct] = useState([]);
    const [search, setSearch] = useState("");
    const [filterSearch, setFilterSearch] = useState([]);
    const navigate = useNavigate();

    const getProduct = async () => {
        try {
            const res = await axios.get('http://localhost:8080/products');
            setProduct(res.data);
            setFilterSearch(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/products/${id}`);
            alert("Deleted product!");
            setFilterSearch(filterSearch.filter(elem => elem._id !== id));
        } catch (error) {
            console.log("Error deleting product", error);
            alert("Failed to delete product");
        }
    };

     // دالة طباعة التقرير
     const generatePDF = async () => {
        const doc = new jsPDF();
        doc.text("Products Report", 14, 15);

        // تعريف الأعمدة
        const tableColumn = ["Product Image", "Product Name", "Category", "Price","Serial Number" , "Expiration Date"];
        const tableRows = [];

        // تحويل الصور إلى Base64
        const convertImageToBase64 = (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = url;
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = 50;  // تحديد حجم موحد للصورة
                    canvas.height = 50;
                    ctx.drawImage(img, 0, 0, 50, 50);
                    resolve(canvas.toDataURL("image/png"));
                };
            });
        };

        for (const item of product) {
            const expirationDate = item.productHistory ? new Date(item.productHistory).toLocaleDateString() : "N/A";
            // const productEntryDate = item.productEntryDate ? new Date(item.productEntryDate).toLocaleDateString() : "N/A";
            const imageBase64 = await convertImageToBase64(`/uploads/${item.image}`);
            tableRows.push([
                { content: "", image: imageBase64, width: 15, height: 15 },  // ✅ إدراج الصورة
                item.productName,
                item.category?.categoryName || "N/A",
                item.price + ' AED',
                item.serialNumber,
                expirationDate,
                // productEntryDate
            ]);
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: "grid",
            styles: { fontSize: 12, cellPadding: 5, valign: "middle", halign: "center" },
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // لون الرأس أزرق ونص أبيض
            alternateRowStyles: { fillColor: [240, 240, 240] }, // تناوب الألوان في الصفوف
            didDrawCell: function (data) {
                if (data.column.index === 0 && data.cell.raw.image) {
                    doc.addImage(data.cell.raw.image, "PNG", data.cell.x + 2, data.cell.y + 2, 15, 15);
                }
            }
        });

        doc.save("products_report.pdf");
    };
   
    const columns = [
        {
            name: 'Product Image',
            selector: (row) => <img width={50} height={50} src={`/uploads/${row.image}`} alt="Product" />
        },
        {
            name: 'Product Name',
            selector: (row) => row.productName,
            sortable: true
        },
        {
            name: 'Category',
            selector: (row) =>row.category ? row.category.categoryName : "You did not add it",
            sortable: true
        },
        {
            cell: (product) => <>
                <button className="btn btn-secondary me-2" onClick={() => navigate(`/detailsproduct/${product._id}`)}><FcViewDetails />  </button>
                <button className="btn btn-primary me-2" onClick={() => navigate(`/editproduct/${product._id}`)}><FaEdit />
                </button> <button className="btn btn-danger" onClick={() => deleteProduct(product._id)}> <MdDelete /></button>
            </>
        }
    ];

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        const result = product.filter((row) => row.productName.toLowerCase().includes(search.toLowerCase()));
        setFilterSearch(result);
    }, [search, product]);

    return (

        <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
            <h3 className="text-success">List of Products</h3>
            <div>
                <button className="btn btn-secondary me-2 mb-2 mb-md-0" onClick={() => navigate("/addnewproduct")}>Add New Product</button>
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

export default Products;
