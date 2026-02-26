import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddClinic from "./components/AddClinic";
import Login from "./components/Login"
import AddCase from "./components/cases/AddCase"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/doctors/addClinic" element={<AddClinic />} />
                <Route path="/cases/addCase" element={<AddCase />} />
            </Routes>
        </BrowserRouter>
    );
}