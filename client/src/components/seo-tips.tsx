import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Target, 
  Zap, 
  TrendingUp,
  Search,
  Smartphone,
  Image,
  Link
} from "lucide-react";

export function SEOTips() {
  const tips = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Optimisez vos balises Title",
      description: "Utilisez des mots-clés pertinents dans vos titres de page. Maximum 60 caractères pour éviter la troncature.",
      impact: "Élevé",
      difficulty: "Facile",
      color: "text-green-600"
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Améliorez vos méta-descriptions",
      description: "Rédigez des descriptions attrayantes de 150-160 caractères qui incitent au clic.",
      impact: "Élevé",
      difficulty: "Facile",
      color: "text-green-600"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Optimisez pour mobile",
      description: "Plus de 60% du trafic e-commerce vient du mobile. Testez votre vitesse de chargement.",
      impact: "Critique",
      difficulty: "Moyen",
      color: "text-red-600"
    },
    {
      icon: <Image className="h-5 w-5" />,
      title: "Optimisez vos images",
      description: "Ajoutez des attributs ALT descriptifs et compressez vos images pour réduire le temps de chargement.",
      impact: "Moyen",
      difficulty: "Facile",
      color: "text-yellow-600"
    },
    {
      icon: <Link className="h-5 w-5" />,
      title: "Structure URL propre",
      description: "Utilisez des URLs courtes et descriptives avec vos mots-clés principaux.",
      impact: "Moyen",
      difficulty: "Moyen",
      color: "text-yellow-600"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Données structurées",
      description: "Implémentez le schema.org pour les produits, avis et breadcrumbs.",
      impact: "Élevé",
      difficulty: "Difficile",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Conseils SEO Gratuits</h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Appliquez ces optimisations simples pour améliorer immédiatement votre référencement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tips.map((tip, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    {tip.icon}
                  </div>
                  <div className="flex space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`${tip.color} border-current text-xs`}
                    >
                      {tip.impact}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {tip.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <Zap className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            Besoin d'une analyse personnalisée ?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Découvrez exactement quels problèmes SEO impactent VOTRE boutique
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Analyser ma boutique gratuitement
          </Button>
        </div>
      </div>
    </section>
  );
}