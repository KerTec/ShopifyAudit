import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  CheckCircle,
  HelpCircle,
  CreditCard,
  Bug,
  Lightbulb
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les 24 heures.",
      });
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactTypes = [
    { id: 'general', label: 'Question générale', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'payment', label: 'Problème de paiement', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'bug', label: 'Signaler un bug', icon: <Bug className="h-4 w-4" /> },
    { id: 'feature', label: 'Suggestion de fonctionnalité', icon: <Lightbulb className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Une question ? Un problème ? Nous sommes là pour vous aider
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Envoyez-nous un message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type de demande</label>
                  <div className="grid grid-cols-2 gap-2">
                    {contactTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.type === type.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={formData.type === type.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        {type.icon}
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sujet</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Résumé de votre demande"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre demande en détail..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & FAQ */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Informations de contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Temps de réponse</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Moins de 24 heures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Disponibilité</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">7j/7, 24h/24</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Comment fonctionne l'audit SEO ?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notre outil analyse automatiquement plus de 25 critères SEO de votre boutique Shopify en quelques secondes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Que contient le rapport PDF ?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Le rapport premium inclut une analyse détaillée, des recommandations prioritaires et un format professionnel.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Le paiement est-il sécurisé ?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Oui, nous utilisons Stripe pour tous les paiements, garantissant une sécurité maximale de vos données.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-bold mb-4">Pourquoi nous faire confiance ?</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500 text-white">5000+</Badge>
                      <span>Audits réalisés</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500 text-white">98%</Badge>
                      <span>Satisfaction client</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-500 text-white">24h</Badge>
                      <span>Support réactif</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-orange-500 text-white">SSL</Badge>
                      <span>Données sécurisées</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}