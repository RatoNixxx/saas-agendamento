import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PricingCard from './PricingCard'
import { SparklesIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function LandingPage() {
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)

  const plans = [
    { name: 'Básico', price: 'R$ 29', features: ['1 profissional', 'Agendamentos ilimitados', 'Link personalizado'] },
    { name: 'Profissional', price: 'R$ 59', features: ['3 profissionais', 'Relatórios', 'Integração WhatsApp'] },
    { name: 'Negócio', price: 'R$ 99', features: ['10 profissionais', 'API', 'Suporte prioritário'] }
  ]

  const handleSubscribe = (planName) => {
    setShowCheckout(true)
    setTimeout(() => {
      alert(`Assinatura do plano ${planName} realizada com sucesso! (simulação)`)
      setShowCheckout(false)
      navigate('/signup')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          AgendaPro <SparklesIcon className="inline w-10 h-10 text-yellow-400" />
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
          O sistema de agendamento mais avançado para profissionais. <br />Gerencie sua agenda com estilo e eficiência.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-lg font-semibold hover:scale-105 transition transform shadow-lg shadow-blue-500/50"
        >
          Começar grátis
        </button>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl">
          <CalendarIcon className="w-12 h-12 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Agendamento inteligente</h3>
          <p className="text-gray-300">Clientes marcam horários em tempo real, sem conflitos.</p>
        </div>
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl">
          <UserGroupIcon className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Gestão de clientes</h3>
          <p className="text-gray-300">Histórico completo e notificações automáticas.</p>
        </div>
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl">
          <SparklesIcon className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Link personalizado</h3>
          <p className="text-gray-300">Compartilhe seu link exclusivo e receba agendamentos.</p>
        </div>
      </div>

      {/* Pricing */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Escolha seu plano</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              onSubscribe={() => handleSubscribe(plan.name)}
              disabled={showCheckout}
            />
          ))}
        </div>
      </div>
    </div>
  )
}