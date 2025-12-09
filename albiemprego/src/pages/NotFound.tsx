import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-6">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* 404 Text */}
          <div className="text-center mb-6">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              404
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-6"></div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              Página Não Encontrada
            </h2>
            <p className="text-slate-600 text-lg mb-2">
              Ops! A página que você está procurando não existe.
            </p>
            <p className="text-slate-500 text-sm">
              A URL pode estar incorreta ou a página foi removida.
            </p>
          </div>

          {/* URL Info */}
          <div className="bg-slate-50 rounded-lg p-4 mb-8 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Caminho solicitado:</p>
            <code className="text-sm text-slate-700 font-mono break-all">
              {location.pathname}
            </code>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>

            <a
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Ir para Início
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-slate-600 text-sm">
            Precisa de ajuda?{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
