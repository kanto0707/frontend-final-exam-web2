import { Link } from "react-router-dom";

export default function PageIntrouvable({ user }) {
    const home = user ? (user.role === "admin" ? "/admin" : "/student") : "/login";

    return (
        <div className="page">
            <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
                <span className="eyebrow">Erreur 404</span>
                <h1>Page introuvable</h1>
                <p>Cette page n'existe pas ou a été déplacée.</p>
                <Link to={home} className="btn-primary">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
