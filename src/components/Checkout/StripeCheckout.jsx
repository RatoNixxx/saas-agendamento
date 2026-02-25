import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../../lib/supabase';

// Carrega Stripe uma única vez
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function StripeCheckout({ plan, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mapeamento dos planos para Price IDs da Stripe
  const priceIds = {
    'Básico': 'price_1T4VMp2Z04DEDmWi53MRD3c6',
    'Profissional': 'price_1T4VPw2Z04DEDmWi3HbJTZcj',
    'Negócio': 'price_1T4VQR2Z04DEDmWituc1r0Y9'
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Pegar usuário logado (se estiver)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Se não estiver logado, redireciona para cadastro
        window.location.href = '/signup';
        return;
      }

      // Chamar nossa função serverless
      const response = await fetch('/.netlify/functions/create-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: priceIds[plan.name],
          customerEmail: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de pagamento');
      }

      // Redirecionar para o checkout da Stripe
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
      
    } catch (err) {
      console.error('Erro no checkout:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-2xl max-w-md w-full border border-gray-700">
        <h3 className="text-xl font-bold mb-2">Assinar plano {plan.name}</h3>
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
          {plan.price}
        </p>
        
        <div className="mb-6 text-gray-300 space-y-2">
          <p className="text-sm">✅ Pagamento seguro processado pela Stripe</p>
          <p className="text-sm">✅ Aceitamos cartão de crédito e boleto</p>
          <p className="text-sm">✅ Cancele quando quiser</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 p-3 bg-red-900/20 rounded-lg">
            ❌ {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Assinar'}
          </button>
        </div>
      </div>
    </div>
  );
}