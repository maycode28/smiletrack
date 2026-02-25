import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddClinic from "./components/AddClinic";
import Login from "./components/Login"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/doctors/addClinic" element={<AddClinic />} />
            </Routes>
        </BrowserRouter>
    );
}