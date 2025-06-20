
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Cookie, UserCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Protection et utilisation de vos données personnelles
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Dernière mise à jour : Janvier 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Collecte des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Données collectées</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Données d'audit</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • URL de votre boutique Shopify<br/>
                  • Données publiques de votre site (balises meta, structure HTML)<br/>
                  • Métriques de performance (temps de chargement, taille des fichiers)
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Données de paiement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Email pour l'envoi du rapport PDF<br/>
                  • Données de facturation traitées par Stripe (non stockées sur nos serveurs)
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Données techniques</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Adresse IP (anonymisée)<br/>
                  • Type de navigateur et appareil<br/>
                  • Pages visitées et temps de session
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Utilisation des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Utilisation des données</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Finalités principales</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Génération des rapports d'audit SEO<br/>
                  • Traitement des paiements et envoi des rapports PDF<br/>
                  • Amélioration de la qualité de notre service<br/>
                  • Support client et assistance technique
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Finalités secondaires</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Analyse statistique anonyme de l'utilisation<br/>
                  • Prévention de la fraude et des abus<br/>
                  • Respect des obligations légales
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conservation des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Conservation et sécurité</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Durée de conservation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Données d'audit : 30 jours maximum<br/>
                  • Emails de contact : 2 ans après dernier contact<br/>
                  • Données de facturation : 10 ans (obligation légale)
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mesures de sécurité</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Chiffrement SSL/TLS pour tous les échanges<br/>
                  • Accès restreint aux données par mot de passe<br/>
                  • Sauvegardes sécurisées et chiffrées<br/>
                  • Surveillance continue des accès
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cookie className="h-5 w-5" />
                <span>Cookies et traceurs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Cookies essentiels</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Session utilisateur et préférences d'affichage<br/>
                  • Sécurité et prévention des attaques<br/>
                  • Fonctionnement du système de paiement
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cookies analytiques</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • Mesure d'audience anonyme<br/>
                  • Amélioration de l'expérience utilisateur<br/>
                  • Optimisation des performances du site
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Droits des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Vos droits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Droits RGPD</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • <strong>Droit d'accès</strong> : Connaître les données que nous avons sur vous<br/>
                  • <strong>Droit de rectification</strong> : Corriger des données inexactes<br/>
                  • <strong>Droit à l'effacement</strong> : Supprimer vos données personnelles<br/>
                  • <strong>Droit d'opposition</strong> : Refuser certains traitements<br/>
                  • <strong>Droit à la portabilité</strong> : Récupérer vos données
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Exercer vos droits</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pour exercer ces droits, contactez-nous via notre{" "}
                  <a href="/contact" className="text-blue-600 hover:text-blue-700">
                    formulaire de contact
                  </a>{" "}
                  en précisant votre demande. Réponse sous 30 jours maximum.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Partage des données */}
          <Card>
            <CardHeader>
              <CardTitle>Partage des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Partenaires techniques</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  • <strong>Stripe</strong> : Traitement sécurisé des paiements<br/>
                  • <strong>Replit</strong> : Hébergement de l'application<br/>
                  • <strong>Services tiers</strong> : Uniquement si nécessaire au service
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Aucune vente de données</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nous ne vendons jamais vos données personnelles à des tiers. Aucune donnée n'est partagée à des fins commerciales ou publicitaires.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact DPO */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle>Contact et réclamations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pour toute question sur cette politique de confidentialité ou pour exercer vos droits :
              </p>
              <div className="space-y-2">
                <a href="/contact" className="text-blue-600 hover:text-blue-700 text-sm block">
                  📧 Formulaire de contact
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  En cas de désaccord, vous pouvez saisir la CNIL : www.cnil.fr
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
