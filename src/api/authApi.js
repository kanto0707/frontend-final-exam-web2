export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function getStoredUser() {
    const raw = localStorage.getItem("examina_user");
    return raw ? JSON.parse(raw) : null;
}

export function getToken() {
    return localStorage.getItem("examina_token");
}

export function getUserDisplayName(user) {
    if (!user) return "";
    return [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name || user.email;
}

function storeSession(token, user) {
    localStorage.setItem("examina_token", token);
    localStorage.setItem("examina_user", JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem("examina_token");
    localStorage.removeItem("examina_user");
}


export function login(email, password) {
    return fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            return { ok: res.ok, data };
        })
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data?.message || "Email ou mot de passe incorrect.");
            }

            if (!data.token || !data.user) {
                throw new Error("Réponse de connexion invalide.");
            }

            const user = {
                ...data.user,
                first_name: data.user.first_name || data.user.name?.split(" ")[0] || "",
                last_name: data.user.last_name || data.user.name?.split(" ").slice(1).join(" ") || "",
            };
            storeSession(data.token, user);
            return user;
        });
}

export function logout() {
    clearSession();
}
