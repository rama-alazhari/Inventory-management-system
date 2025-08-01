import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const StoreInventory = () => {
    const { id } = useParams(); // جلب معرف المخزن من الـ URL
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [storeName, setStoreName] = useState("");

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/store/${id}/inventory`);
                setInventory(res.data);
                // جلب اسم المخزن
                const storeRes = await axios.get(`http://localhost:8080/store/${id}`);
                setStoreName(storeRes.data.storename);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };

        fetchInventory();
    }, [id]);

    // دالة طباعة التقرير
    const generatePDF = async () => {  
        const doc = new jsPDF();  
        doc.text(`Store Inventory Report - ${storeName}`, 14, 15);  
    
        const tableColumn = ["Product Image", "Product Name", "Available Quantity", "Serial Number", "Place Product"];  
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
    
        for (const item of inventory) {  
            const product = item.productId; // اختصار للكود  
    
            if (product) { // تحقق من وجود المنتج  
                const imageBase64 = await convertImageToBase64(`/uploads/${product.image}`);  
                tableRows.push([  
                    { content: "", image: imageBase64, width: 15, height: 15 },  // إدراج الصورة  
                    product.productName,  
                    item.quantity,  
                    product.serialNumber,  
                    item.placeProduct || "Not Assigned"  
                ]);  
            } else {  
                // إذا كان المنتج غير موجود، يمكن إدراج صف فارغ أو صف بالتفاصيل الخاصة بالمنتج المحذوف  
                tableRows.push([  
                    { content: "", image: "", width: 15, height: 15 }, // يمكنك ترك الصورة فارغة  
                    "Deleted Product",  
                    item.quantity,  
                    "Not Found",  
                    item.placeProduct || "Not Assigned"  
                ]);  
            }  
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
    
        doc.save(`${storeName}_Inventory_Report.pdf`);  
    };  
    
    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">{storeName} Inventory</h3>

            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>⬅ Back</button>
                <button className="btn btn-success" onClick={generatePDF}>🖨 Print Report</button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Product Image</th>
                            <th>Product Name</th>
                            <th>Available Quantity</th>
                            <th>Serial Number</th>
                            <th>Place Product</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            inventory.length > 0 ? (
                                inventory.map(item => {
                                    const product = item.productId; // اختصار للكود  

                                    return (
                                        <tr key={product ? product._id : item._id}> {/* استخدام _id بدلاً من productId إذا كان product غير موجود */}
                                            <td>
                                                {product ? (
                                                    <img width={50} height={50} src={`/uploads/${product.image}`} alt="Product" />
                                                ) : (
                                                    <span>No Image</span> // إذا لم يكن هناك منتج، عرض رسالة بدلاً من الصورة  
                                                )}
                                            </td>
                                            <td>{product ? product.productName : "Deleted Product"}</td>
                                            <td>{item.quantity}</td>
                                            <td>{product ? product.serialNumber : "Not Found"}</td>
                                            <td>{item.placeProduct ? item.placeProduct : "You did not add it"}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5">No products available in this store.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreInventory;
