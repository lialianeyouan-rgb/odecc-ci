import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { authService } from "../../services/authService";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login(username.trim(), password);
      navigate("/admin");
    } catch (err) {
      console.error("Erreur de connexion admin", err);
      setError("Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-odec-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Logo className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-odec-blue-900 font-montserrat">
            Espace Administration
          </h1>
          <p className="text-gray-500">Accès réservé aux administrateurs</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none transition-all"
              placeholder="Ex: admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none transition-all"
              placeholder="Mot de passe"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-odec-gold-500 hover:bg-odec-gold-600 text-odec-blue-900 font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-60"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-odec-blue-700 hover:underline text-sm font-medium"
          >
            Retour a l'accueil du site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
