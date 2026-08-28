import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Veuillez renseigner votre email et votre mot de passe.");
            return;
        }

        setLoading(true);
        onLogin(email.trim(), password, role)
            .then((user) => {
                navigate(user.role === "admin" ? "/admin" : "/student", { replace: true });
            })
            .catch((err) => {
                setError(err.message || "Une erreur est survenue lors de la connexion.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="auth-screen">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="seal">EX</span>
                    <span className="auth-title">Examina</span>
                </div>
                <p className="auth-sub">Plateforme de gestion et de passage d'examens.</p>


                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="vous@exemple.com"
                            autoComplete="username"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn-primary btn-block" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="auth-footnote">
                    Les étudiants ne peuvent pas modifier leur mot de passe eux-mêmes —
                    contactez un administrateur si besoin.
                </p>
            </div>
        </div>
    );
}
