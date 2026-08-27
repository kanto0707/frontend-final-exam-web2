import { getStoredUser } from "../../api/authApi";

const ROLE_LABELS = {
    ADMIN: "Admin",
    ETUDIANT: "Student",
};

export default function StudentProfile({ user }) {
    const currentUser = user || getStoredUser();

    if (!currentUser) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">
                        Impossible de charger vos informations. Veuillez vous reconnecter.
                    </div>
                </div>
            </div>
        );
    }

    const fullName = [currentUser.first_name, currentUser.name].filter(Boolean).join(" ");
    const roleLabel = ROLE_LABELS[currentUser.role] || currentUser.role;

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Profil</span>
                    <h1>Mon compte</h1>
                </div>

                <div className="profile-card">
                    <div className="profile-row">
                        <span className="profile-label">Nom</span>
                        <span className="profile-value">{fullName}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Email</span>
                        <span className="profile-value">{currentUser.email}</span>
                    </div>
                    <div className="profile-row profile-row-last">
                        <span className="profile-label">Type de compte</span>
                        <span className="profile-value">{roleLabel}</span>
                    </div>

                    <div className="profile-note">
                        Vous ne pouvez pas modifier votre mot de passe depuis cette page. Si vous
                        souhaitez le changer, contactez un administrateur : il est le seul habilité
                        à modifier votre mot de passe.
                    </div>
                </div>
            </div>
        </div>
    );
}