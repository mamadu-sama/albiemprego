import { Link } from "react-router-dom";
import { Briefcase, Facebook, Linkedin, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  candidatos: [
    { href: "/vagas", label: "Procurar Vagas" },
    { href: "/auth/register?type=candidato", label: "Criar Conta" },
    { href: "/candidato/alertas", label: "Alertas de Emprego" },
    { href: "/sobre", label: "Como Funciona" },
  ],
  empresas: [
    { href: "/auth/register?type=empresa", label: "Publicar Vaga" },
    { href: "/empresa/plano", label: "Planos e Preços" },
    { href: "/empresa/candidatos", label: "Pesquisar Candidatos" },
    { href: "/sobre", label: "Porquê AlbiEmprego" },
  ],
  recursos: [
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/estatisticas-salarios", label: "Estatísticas Salariais", isNew: true },
    { href: "/contacto", label: "Contacto" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/termos", label: "Termos de Serviço" },
    { href: "/privacidade", label: "Política de Privacidade" },
    { href: "/cookies", label: "Política de Cookies" },
  ],
};

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Twitter, label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">
                Albi<span className="text-primary">Emprego</span>
              </span>
            </Link>
            <p className="text-sm text-background/60 mb-6 max-w-xs">
              A plataforma líder de emprego na região de Castelo Branco. Conectamos talentos locais a oportunidades extraordinárias.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Castelo Branco, Portugal</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@albiemprego.pt" className="hover:text-primary transition-colors">
                  info@albiemprego.pt
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+351272123456" className="hover:text-primary transition-colors">
                  +351 272 123 456
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-sm font-semibold text-background mb-4">Candidatos</h3>
            <ul className="space-y-3">
              {footerLinks.candidatos.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-background mb-4">Empresas</h3>
            <ul className="space-y-3">
              {footerLinks.empresas.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-background mb-4">Recursos</h3>
<ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.isNew && (
                      <span className="bg-success text-success-foreground text-[10px] font-bold px-1 py-0.5 rounded">
                        Novo
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-background mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} AlbiEmprego. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-2 rounded-full bg-background/10 text-background/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
