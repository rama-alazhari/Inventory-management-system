import React from "react";
import { useAuthStore } from "../store/authStore";

const Header = () => {

    const { logout } = useAuthStore(); // استرجاع البيانات من Zustand  

    const handleLogout = async () => {
        await logout();  // ننتظر حتى تكتمل عملية تسجيل الخروج  
        window.location.reload();  // إعادة تحميل الصفحة  
    };

    return (
        <>
            <nav class="navbar navbar-dark bg-dark w-100">
                <div className="d-flex">
                    {/* <img src={require('../Images/Capture.png')} width={150} height={70} className="d-inline-block align-text-top ms-3" /> */}
                    {/* <h3 className="text-light fs-6 d-md-none  ms-2 ms-md-5 mt-4 mt-md-3"> Lajoya</h3> */}
                    <h3 className="text-light fs-3 ms-5 "> Lajoya</h3>
                </div>
                <button className="btn btn-danger fs-5 me-3" type="button" onClick={handleLogout}>Logout</button> 
            </nav>
        </>
    )

}
export default Header

