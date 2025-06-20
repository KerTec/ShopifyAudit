import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, FileText } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function Pricing() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tarifs & Fonctionnalités
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choisissez la solution qui correspond à vos besoins d'audit SEO
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Audit Gratuit</CardTitle>
              <div className="text-4xl font-bold text-green-600 mb-4">0€</div>
              <p className="text-gray-600 dark:text-gray-300">
                Parfait pour découvrir notre service
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Audit SEO complet (25+ critères)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Score de performance (0-100)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Analyse des problèmes critiques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Export Markdown gratuit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Export JSON gratuit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Plan d'action prioritisé</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-blue-500 hover:shadow-xl transition-shadow">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
              <Star className="h-4 w-4 mr-1" />
              Recommandé
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Rapport Premium</CardTitle>
              <div className="text-4xl font-bold text-blue-600 mb-4">9,99€</div>
              <p className="text-gray-600 dark:text-gray-300">
                Rapport professionnel complet
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Tout ce qui est gratuit +</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span>Rapport PDF professionnel</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>Design premium & branding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-blue-500" />
                  <span>Recommandations détaillées</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-blue-500" />
                  <span>Analyses techniques approfondies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-blue-500" />
                  <span>Format prêt à présenter</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-3xl mx-auto border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Pourquoi choisir ShopifyAudit ?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="font-semibold mb-2">Analyse Instantanée</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Obtenez votre audit SEO en moins de 30 secondes
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold mb-2">25+ Critères</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Analyse complète selon les standards SEO actuels
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">💼</div>
                <h4 className="font-semibold mb-2">Rapport Pro</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Format professionnel prêt à présenter à vos clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}