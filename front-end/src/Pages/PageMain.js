import React, { useState, useEffect } from "react";
import axios from "axios";
import { FcBusinessman } from "react-icons/fc";
import { BiSolidCategory, BiImport, BiExport } from "react-icons/bi";
import { LiaWarehouseSolid } from "react-icons/lia";
import { GrProductHunt } from "react-icons/gr";
import moment from "moment-timezone";

const PageMain = () => {
    const [importExportData, setImportExportData] = useState([]);
    const [importCounts, setImportCounts] = useState({ daily: 0, monthly: 0, yearly: 0 });
    const [exportCounts, setExportCounts] = useState({ daily: 0, monthly: 0, yearly: 0 });
    const [userCount, setUserCount] = useState(0);
    const [storeCount, setStoreCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [userRes, storeRes, categoryRes, productRes, importExportRes] = await Promise.all([
                    axios.get("http://localhost:8080/users/count"),
                    axios.get("http://localhost:8080/store/count"),
                    axios.get("http://localhost:8080/category/count"),
                    axios.get("http://localhost:8080/products/count"),
                    axios.get("http://localhost:8080/import-export/all"),
                ]);

                setUserCount(userRes.data.count);
                setStoreCount(storeRes.data.count);
                setCategoryCount(categoryRes.data.count);
                setProductCount(productRes.data.count);
                setImportExportData(importExportRes.data.data);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, []);

    useEffect(() => {
        if (importExportData.length > 0) {
            const now = moment().tz("Asia/Dubai");
            const startOfDay = now.clone().startOf("day");
            const startOfMonth = now.clone().startOf("month");
            const startOfYear = now.clone().startOf("year");

            const dailyImport = importExportData.filter(record =>
                record.inputOrOutput === "Import" && moment(record.createdAt).isSameOrAfter(startOfDay)
            ).length;
            const monthlyImport = importExportData.filter(record =>
                record.inputOrOutput === "Import" && moment(record.createdAt).isSameOrAfter(startOfMonth)
            ).length;
            const yearlyImport = importExportData.filter(record =>
                record.inputOrOutput === "Import" && moment(record.createdAt).isSameOrAfter(startOfYear)
            ).length;

            const dailyExport = importExportData.filter(record =>
                record.inputOrOutput === "Export" && moment(record.createdAt).isSameOrAfter(startOfDay)
            ).length;
            const monthlyExport = importExportData.filter(record =>
                record.inputOrOutput === "Export" && moment(record.createdAt).isSameOrAfter(startOfMonth)
            ).length;
            const yearlyExport = importExportData.filter(record =>
                record.inputOrOutput === "Export" && moment(record.createdAt).isSameOrAfter(startOfYear)
            ).length;

            setImportCounts({ daily: dailyImport, monthly: monthlyImport, yearly: yearlyImport });
            setExportCounts({ daily: dailyExport, monthly: monthlyExport, yearly: yearlyExport });
        }
    }, [importExportData]);

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <StatCard title="Users" count={userCount} icon={<FcBusinessman size={50} />} color="#D1A30A" />
                <StatCard title="Store" count={storeCount} icon={<LiaWarehouseSolid size={50} />} color="#A40C86" />
                <StatCard title="Categories" count={categoryCount} icon={<BiSolidCategory size={40} />} color="#0599D9" />
                <StatCard title="Products" count={productCount} icon={<GrProductHunt size={40} />} color="#4172E2" />
            </div>
            <div className="row justify-content-center mt-4">
                <StatCard
                    title="Imports" count={importCounts.daily}
                    monthly={importCounts.monthly} yearly={importCounts.yearly}
                    icon={<BiImport size={40} />} color="green"
                />
                <StatCard
                    title="Exports" count={exportCounts.daily}
                    monthly={exportCounts.monthly} yearly={exportCounts.yearly}
                    icon={<BiExport size={40} />} color="#BB0423"
                />
            </div>
        </div>
    );
};

const StatCard = ({ title, count, monthly, yearly, icon, color }) => {
    return (
        <div className="col-5 col-lg-4 shadow-lg rounded m-2 p-3 text-center" style={{ backgroundColor: color, color: "#fff" }}>
            <div className="d-flex justify-content-between align-items-center">
                <p className="fst-italic font-monospace fs-5">{icon} {title}</p>
                <p className="mb-1 fs-2">{count}</p>

            </div>
            {/* <p className="mb-1 fs-6">Daily: {count}</p> */}
            {monthly !== undefined && yearly !== undefined && (
                <>
                    <p className="mb-1 fs-6">🟢 Daily : {count}</p>
                    <p className="mb-1 fs-6">📅 Monthly : {monthly}</p>
                    <p className="mb-1 fs-6">📆 Yearly : {yearly}</p>
                </>
            )}
        </div>
    );
};

export default PageMain;
