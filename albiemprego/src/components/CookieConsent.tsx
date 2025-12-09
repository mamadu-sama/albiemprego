import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "albiemprego_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "dismissed");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl rounded-xl border bg-card shadow-lg">
            <div className="relative p-4 md:p-6">
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-start gap-3 md:items-center">
                  <div className="rounded-full bg-primary/10 p-2.5 shrink-0">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 pr-6 md:pr-0">
                    <h3 className="font-semibold text-foreground mb-1">
                      Utilizamos cookies
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Usamos cookies para melhorar a sua experiência no nosso site. 
                      Ao continuar a navegar, concorda com a nossa{" "}
                      <Link
                        to="/cookies"
                        className="text-primary hover:underline font-medium"
                      >
                        Política de Cookies
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-10 md:ml-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReject}
                    className="text-sm"
                  >
                    Recusar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAccept}
                    className="text-sm"
                  >
                    Aceitar todos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
