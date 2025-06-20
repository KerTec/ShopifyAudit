import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { FileImage, Loader2, CreditCard } from "lucide-react";
import { AuditResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PremiumExportProps {
  auditResult: AuditResult;
}

export function PremiumExport({ auditResult }: PremiumExportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePremiumExport = async () => {
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      toast({
        title: "Service temporairement indisponible",
        description: "L'export PDF premium n'est pas configuré",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId: auditResult.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du paiement');
      }

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe non disponible');
      }

      // Create a checkout session instead
      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId: auditResult.id }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session de paiement');
      }

      const { sessionId } = await checkoutResponse.json();
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Premium export error:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || 'Une erreur est survenue lors du paiement',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePremiumExport}
      disabled={isLoading}
      className="w-full flex items-center justify-between p-3 h-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all transform hover:scale-[1.02]"
    >
      <div className="flex items-center">
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-3 animate-spin" />
        ) : (
          <FileImage className="w-4 h-4 mr-3" />
        )}
        <span className="text-sm font-medium">
          PDF Premium
        </span>
      </div>
      <div className="flex items-center">
        <CreditCard className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">9,99€</span>
      </div>
    </Button>
  );
}
