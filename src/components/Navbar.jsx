import { NavLink, useNavigate } from "react-router-dom";
import { getUserDisplayName } from "../api/authApi";

const ADMIN_LINKS = [
    { to: "/admin", label: "Tableau de bord", end: true },
    { to: "/admin/exams", label: "Examens" },
    { to: "/admin/courses", label: "Cours" },
    { to: "/admin/students", label: "Étudiants" },
];

const STUDENT_LINKS = [
    { to: "/student", label: "Examens disponibles", end: true },
    { to: "/student/results", label: "Mes résultats" },
    { to: "/student/profile", label: "Profil" },
];

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    if (!user) return null;

    const links = user.role === "admin" ? ADMIN_LINKS : STUDENT_LINKS;
    const home = user.role === "admin" ? "/admin" : "/student";

    function handleLogout() {
        onLogout();
        navigate("/login", { replace: true });
    }

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <NavLink to={home} className="navbar-brand">
                    <span className="seal">EX</span>
                    Examina
                </NavLink>

                <nav className="navbar-links">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => (isActive ? "active" : undefined)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="navbar-user">
                    <div>
                        <div className="name">{getUserDisplayName(user)}</div>
                        <div className="role-tag">{user.role === "admin" ? "Admin" : "Student"}</div>
                    </div>
                    <button className="btn-outline btn-sm" onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </div>
        </header>
    );
}
