
function getFirstName(user) {
  return user?.first_name || user?.name?.split(" ")[0] || "—";
}

function getLastName(user) {
  return user?.last_name || user?.name?.split(" ").slice(1).join(" ") || "—";
}

export default function StudentProfile({ user }) {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Profil</span>
          <h1>Mon compte</h1>
        </div>

        <div className="profile-card">
          <div className="profile-row">
            <span className="label">Nom</span>
            <span>{getFirstName(user)}</span>
          </div>
          <div className="profile-row">
            <span className="label">Email</span>
            <span>{user?.mail}</span>
          </div>
          <div className="profile-row">
            <span className="label">Type de compte</span>
            <span>Student</span>
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