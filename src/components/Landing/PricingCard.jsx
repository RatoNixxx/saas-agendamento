import { useState } from 'react';
import StripeCheckout from '../Checkout/StripeCheckout';

export default function PricingCard({ plan, disabled }) {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <div className="backdrop-blur-lg bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition group">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
          {plan.price}<span className="text-sm text-gray-400">/mês</span>
        </p>
        <ul className="mb-6 space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowCheckout(true)}
          disabled={disabled}
          className="w-full py-3 bg-white/10 rounded-xl font-semibold border border-white/20 hover:bg-blue-600 hover:border-blue-600 transition disabled:opacity-50"
        >
          Assinar
        </button>
      </div>

      {showCheckout && (
        <StripeCheckout 
          plan={plan} 
          onClose={() => setShowCheckout(false)} 
        />
      )}
    </>
  );
}