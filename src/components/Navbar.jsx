import { NavLink, useNavigate } from "react-router-dom";

const ADMIN_LINKS = [
    { to: "/admin", label: "Tableau de bord", end: true },
    { to: "/admin/exams", label: "Examens" },
    { to: "/admin/subjects", label: "Matières" },
    { to: "/admin/students", label: "Étudiants" },
];

const STUDENT_LINKS = [
    { to: "/student", label: "Accueil", end: true },
    { to: "/student/exams", label: "Examens" },
    { to: "/student/history", label: "Historique" },
    { to: "/student/profile", label: "Profil" },
];

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    if (!user) return null;

    const links = user.role === "admin" ? ADMIN_LINKS : STUDENT_LINKS;
    const home = user.role === "admin" ? "/admin" : "/student";

    function handleLogout() {
        onLogout();
        navigate("/", { replace: true });
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
                        <div className="name">{user.name || user.email}</div>
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
