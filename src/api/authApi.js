export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function getStoredUser() {
    const raw = localStorage.getItem("examina_user");
    return raw ? JSON.parse(raw) : null;
}

export function getToken() {
    return localStorage.getItem("examina_token");
}

function storeSession(token, user) {
    localStorage.setItem("examina_token", token);
    localStorage.setItem("examina_user", JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem("examina_token");
    localStorage.removeItem("examina_user");
}


export function login(email, password, role) {
    return fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
    })
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data?.message || "Email ou mot de passe incorrect.");
            }
            storeSession(data.token, data.user);
            return data.user;
        });
}

export function logout() {
    clearSession();
}
