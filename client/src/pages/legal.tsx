
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Building, Mail, Phone, MapPin } from "lucide-react";

export default function Legal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Scale className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mentions Légales
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Informations légales et conditions d'utilisation
          </p>
        </div>

        <div className="space-y-8">
          {/* Éditeur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Éditeur du site</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">ShopifyAudit</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Service d'audit SEO pour boutiques Shopify
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">contact@shopifyaudit.com</span>
              </div>
            </CardContent>
          </Card>

          {/* Hébergement */}
          <Card>
            <CardHeader>
              <CardTitle>Hébergement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ce site est hébergé par Replit Inc.<br/>
                767 Bryant St. #203, San Francisco, CA 94107, États-Unis
              </p>
            </CardContent>
          </Card>

          {/* Propriété intellectuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Les marques, logos, signes et tout autre contenu du site font l'objet d'un droit de propriété intellectuelle et ne peuvent être reproduits ou utilisés sans l'autorisation expresse de ShopifyAudit.
              </p>
            </CardContent>
          </Card>

          {/* Conditions d'utilisation */}
          <Card>
            <CardHeader>
              <CardTitle>Conditions d'utilisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Service fourni</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ShopifyAudit propose un service d'audit SEO automatisé pour les boutiques Shopify. Les résultats sont fournis à titre informatif et ne constituent pas des conseils professionnels.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Limitations de responsabilité</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ShopifyAudit ne peut être tenu responsable des décisions prises sur la base des rapports d'audit fournis. L'utilisateur reste seul responsable de l'implémentation des recommandations.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Paiements</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Les paiements sont traités de manière sécurisée par Stripe. Aucune donnée de carte bancaire n'est stockée sur nos serveurs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pour toute question concernant ces mentions légales :
              </p>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <a href="/contact" className="text-sm text-blue-600 hover:text-blue-700">
                  Formulaire de contact
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
