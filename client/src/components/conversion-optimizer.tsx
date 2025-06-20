import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, DollarSign, Clock } from "lucide-react";

interface ConversionOptimizerProps {
  onUpgrade?: () => void;
}

export function ConversionOptimizer({ onUpgrade }: ConversionOptimizerProps) {
  const [currentOffer, setCurrentOffer] = useState<'urgency' | 'value' | 'social'>('urgency');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  // Rotate offers every 5 minutes
  useEffect(() => {
    const offerRotation = setInterval(() => {
      setCurrentOffer(prev => {
        switch (prev) {
          case 'urgency': return 'value';
          case 'value': return 'social';
          case 'social': return 'urgency';
          default: return 'urgency';
        }
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(offerRotation);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const offers = {
    urgency: {
      title: "Offre Limitée dans le Temps",
      subtitle: "Plus que quelques heures !",
      description: "Profitez de votre rapport PDF premium maintenant avant que cette offre expire",
      badge: "URGENT",
      badgeColor: "bg-red-500",
      icon: <Clock className="h-5 w-5" />,
      cta: "Obtenir mon PDF maintenant"
    },
    value: {
      title: "Économisez des Heures de Travail",
      subtitle: "Valeur 200€ pour seulement 9,99€",
      description: "Un audit SEO manuel vous coûterait 200€ et prendrait 3 heures. Obtenez le même résultat instantanément.",
      badge: "ÉCONOMIE",
      badgeColor: "bg-green-500",
      icon: <DollarSign className="h-5 w-5" />,
      cta: "Économiser 190€ maintenant"
    },
    social: {
      title: "Rejoignez 5000+ Utilisateurs",
      subtitle: "98% recommandent ShopifyAudit",
      description: "Des milliers de propriétaires de boutiques font confiance à nos rapports pour améliorer leur SEO",
      badge: "POPULAIRE",
      badgeColor: "bg-blue-500",
      icon: <TrendingUp className="h-5 w-5" />,
      cta: "Rejoindre la communauté"
    }
  };

  const currentOfferData = offers[currentOffer];

  return (
    <Card className="border-2 border-dashed border-orange-300 dark:border-orange-600 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Badge className={`${currentOfferData.badgeColor} text-white`}>
            {currentOfferData.icon}
            <span className="ml-1">{currentOfferData.badge}</span>
          </Badge>
          {currentOffer === 'urgency' && (
            <Badge variant="outline" className="border-red-300 text-red-600">
              {formatTime(timeLeft)}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl text-gray-900 dark:text-white">
          {currentOfferData.title}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {currentOfferData.subtitle}
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {currentOfferData.description}
        </p>
        
        <div className="flex justify-center items-center space-x-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">9,99€</div>
            <div className="text-sm text-gray-500 line-through">200€</div>
          </div>
          <div className="text-center">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Instantané</div>
          </div>
        </div>

        <Button 
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
        >
          {currentOfferData.cta}
        </Button>
        
        <div className="flex justify-center items-center space-x-4 mt-4 text-xs text-gray-500">
          <span>✓ Paiement sécurisé</span>
          <span>✓ Satisfaction garantie</span>
          <span>✓ Support 24/7</span>
        </div>
      </CardContent>
    </Card>
  );
}