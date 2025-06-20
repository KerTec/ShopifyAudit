import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "E-commerce Manager",
      company: "Fashion Store",
      content: "ShopifyAudit m'a permis d'identifier 15 problèmes SEO critiques que je n'avais pas remarqués. Mon trafic organique a augmenté de 40% en 2 mois.",
      rating: 5,
      improvement: "+40% trafic"
    },
    {
      name: "Thomas Martin",
      role: "Fondateur",
      company: "Tech Boutique",
      content: "Interface intuitive et rapports détaillés. Le rapport PDF est parfait pour présenter les recommandations à mon équipe.",
      rating: 5,
      improvement: "+25% conversions"
    },
    {
      name: "Sophie Laurent",
      role: "Consultante SEO",
      company: "Freelance",
      content: "J'utilise ShopifyAudit pour tous mes clients Shopify. Les rapports sont professionnels et facturent 150€ par audit.",
      rating: 5,
      improvement: "150€ par audit"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez des milliers d'utilisateurs satisfaits
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Découvrez comment ShopifyAudit aide les propriétaires de boutiques à améliorer leur SEO
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {testimonial.improvement}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>5000+ audits réalisés</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>99.9% disponibilité</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}