import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


const Employee = () => {
    const [users, setusers] = useState([]);
    const [search, setSearch] = useState("");
    const [filterSearch, setFilterSearch] = useState([]);
    const navigate = useNavigate();

    // جلب جميع التصنيفات
    useEffect(() => {
        const getusers = async () => {
            try {
                const res = await axios.get('http://localhost:8080/users');
                setusers(res.data);
                setFilterSearch(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getusers();
    }, []);

    // تصفية البحث
    useEffect(() => {
        const result = users.filter((row) =>
            row.username.toLowerCase().includes(search.toLowerCase())
        );
        setFilterSearch(result);
    }, [search, users]);

    // حذف تصنيف
    const deleteusers = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/users/${id}`);
            alert("Deleted user!");
            setFilterSearch(filterSearch.filter((elem) => elem._id !== id));
        } catch (error) {
            console.log("Error deleting users", error);
            alert("Failed to delete users");
        }
    };

    // أعمدة الجدول
    const columns = [
        {
            name: "User Name",
            selector: (row) => row.username,
            sortable: true,
        },
        {
            name: "Email Address",
            selector: (row) => row.email,
            sortable: true,
        },
        {  
            name: "Last Login",  
            selector: (row) => {  
                const options = {  
                    year: 'numeric',  
                    month: '2-digit',  
                    day: '2-digit',  
                    hour: '2-digit',  
                    minute: '2-digit',  
                    second: '2-digit',  
                    hour12: true, // لتفعيل نظام 12 ساعة  
                    timeZone: 'Asia/Dubai', // تعيين المنطقة الزمنية لتوقيت الإمارات  
                };  
                return new Date(row.lastLogin).toLocaleString('en-US', options);  
            },  
            sortable: true,  
        }, 
        {
            cell: (users) => 
                <>
                    <button className="btn btn-primary me-2" onClick={() => navigate(`/edit-user/${users._id}`)}><FaEdit /></button>
                    <button className="btn btn-danger" onClick={() => deleteusers(users._id)}> <MdDelete /></button>
                </>
           
        },
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="text-success">List of User</h3>
                <div>
                    <button className="btn btn-secondary me-2 mb-2 mb-md-0" onClick={() => navigate("/add-new-user")}>Add New User</button>
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

export default Employee;
