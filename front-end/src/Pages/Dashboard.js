import React from 'react'
import { NavLink, Outlet } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { LiaWarehouseSolid ,LiaFileInvoiceSolid } from "react-icons/lia";
import { GrProductHunt } from "react-icons/gr";
import { MdImportExport } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { AiFillMedicineBox } from "react-icons/ai";

const Dashboard = () => {

    const style1 = ({ isActive }) => ({
        color: isActive ? "#ffffff" : "#333",
        backgroundColor: isActive ? "#28a745" : "transparent",
        padding: "10px",
        borderRadius: "5px",
        display: "block",
        marginBottom: "10px",
        fontSize: isActive ? "20px" : "18px",
        textDecoration: "none"
    });
    

    return (
      
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-12 col-md-3 col-lg-2 bg-light sidebar p-3 shadow-lg">
                    <h4 className="text-center mb-4 text-success fw-bold">Dashboard</h4>
                    <NavLink to="/" style={style1}> <MdDashboard size={22} /> Dashboard</NavLink>
                    <NavLink to="employee" style={style1}> <CiUser size={22} /> Users</NavLink>
                    <NavLink to="store" style={style1}> <LiaWarehouseSolid size={22} /> Store</NavLink>
                    <NavLink to="category" style={style1}> <BiSolidCategory size={22} /> Category</NavLink>
                    <NavLink to="products" style={style1}> <GrProductHunt size={22} /> Products</NavLink>
                    <NavLink to="importandexport" style={style1}> <MdImportExport size={22} /> Import/Export</NavLink>
                    <NavLink to="medicine" style={style1}> <AiFillMedicineBox size={22} /> Medicine</NavLink>
                    <NavLink to="invoices" style={style1}> <LiaFileInvoiceSolid size={22} /> Invoices</NavLink>

                </div>

                {/* Main Content */}
                <div className="col-12 col-md-9 col-lg-10 p-4 ">
                    <Outlet />
                </div>
            </div>
        </div>
        
    )
}

export default Dashboard
