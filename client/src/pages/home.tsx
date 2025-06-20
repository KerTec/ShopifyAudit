import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Download, 
  FileImage, 
  TrendingUp, 
  Smartphone, 
  Shield,
  Github,
  Moon,
  Sun,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { SEOAuditForm } from "@/components/seo-audit-form";
import { AuditResults } from "@/components/audit-results";
import { Testimonials } from "@/components/testimonials";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { AuditResult } from "@shared/schema";

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Handle payment success/cancel from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const auditId = urlParams.get('audit');

    if (payment === 'success' && auditId) {
      toast({
        title: "Paiement réussi !",
        description: "Votre rapport PDF premium sera disponible sous peu. Vérifiez votre email.",
        variant: "default",
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (payment === 'cancelled') {
      toast({
        title: "Paiement annulé",
        description: "Votre paiement a été annulé. Vous pouvez réessayer à tout moment.",
        variant: "destructive",
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handleAuditStart = () => {
    setShowResults(false);
  };

  const handleAuditComplete = (result: AuditResult) => {
    setAuditResult(result);
    setShowResults(true);
  };

  const handleNewAudit = () => {
    setAuditResult(null);
    setShowResults(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
          <>
            {/* Hero Section with Audit Form */}
            <section className="mb-12">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Auditez votre boutique Shopify{" "}
                    <span className="text-emerald-600">gratuitement</span>
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                    Identifiez les problèmes SEO qui limitent votre visibilité et obtenez un plan d'action détaillé en quelques secondes.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Analyse complète SEO
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Export gratuit MD/JSON
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Rapport PDF premium
                    </span>
                  </div>
                </div>

                <SEOAuditForm
                  onAuditComplete={handleAuditComplete}
                  onAuditStart={handleAuditStart}
                />
              </div>
            </section>

            {/* Features Section */}
            <section className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Tout ce dont vous avez besoin pour optimiser votre SEO
                </h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Notre outil d'audit analyse plus de 50 critères SEO essentiels pour identifier précisément les opportunités d'amélioration de votre boutique Shopify.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-lg">Analyse SEO Complète</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Évaluation détaillée des balises meta, structure HTML, images, vitesse de chargement et bien plus encore.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">Exports Gratuits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Téléchargez vos résultats en Markdown ou JSON, ou copiez-les directement dans le presse-papiers.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                      <FileImage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Rapport PDF Premium</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Rapport professionnel complet avec recommandations détaillées et plan d'action prioritisé.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Score SEO Dynamique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Évaluation chiffrée de votre performance SEO avec catégorisation claire des problèmes à résoudre.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Smartphone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-lg">Optimisation Mobile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Vérification spécifique de l'expérience mobile et des Core Web Vitals pour un meilleur classement.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-lg">Sécurité & Confidentialité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Aucune donnée personnelle collectée, analyse côté serveur sécurisée et respectueuse de votre vie privée.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        ) : (
          /* Audit Results */
          auditResult && (
            <AuditResults 
              auditResult={auditResult} 
              onNewAudit={handleNewAudit}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
                <Search className="w-3 h-3 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ShopifyAudit
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              Optimisez le SEO de votre boutique Shopify avec notre outil d'audit gratuit et professionnel.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="/legal" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                Mentions légales
              </a>
              <a href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                Confidentialité
              </a>
              <a href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                Contact
              </a>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
              © 2024 ShopifyAudit. Développé avec ❤️ pour la communauté Shopify.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
