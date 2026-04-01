import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto p-6">
                    <Toaster />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
