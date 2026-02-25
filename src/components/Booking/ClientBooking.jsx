import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ServiceSelection from './ServiceSelection'
import DateTimePicker from './DateTimePicker'
import Confirmation from './Confirmation'
import { SparklesIcon } from '@heroicons/react/24/solid'

export default function ClientBooking() {
  const { slug } = useParams()
  const [professional, setProfessional] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '' })
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetchProfessional()
  }, [slug])

  async function fetchProfessional() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('unique_slug', slug)
      .maybeSingle()
    if (!error && data) {
      setProfessional(data)
      fetchServices(data.id)
    }
  }

  async function fetchServices(userId) {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId)
    setServices(data || [])
  }

  async function handleConfirm(clientData) {
    const { error } = await supabase
      .from('appointments')
      .insert([{
        user_id: professional.id,
        service_id: selectedService.id,
        client_name: clientData.name,
        client_email: clientData.email,
        client_phone: clientData.phone,
        date: selectedDate,
        time: selectedTime
      }])
    if (!error) {
      setStep(4)
    } else {
      alert('Erro: ' + error.message)
    }
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 text-center text-white">
          <h1 className="text-xl font-bold text-red-400">Profissional não encontrado</h1>
          <p className="text-gray-300 mt-2">O link que você acessou é inválido.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 px-4">
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl p-6">
        <div className="flex items-center space-x-2 mb-2">
          <SparklesIcon className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {professional.store_name}
          </h1>
        </div>
        <p className="text-gray-300 mb-6">Agende seu horário de forma rápida e prática.</p>

        {step === 1 && (
          <ServiceSelection
            services={services}
            onSelect={(s) => { setSelectedService(s); setStep(2) }}
          />
        )}
        {step === 2 && (
          <DateTimePicker
            professional={professional}
            service={selectedService}
            onSelectDateTime={(date, time) => {
              setSelectedDate(date)
              setSelectedTime(time)
              setStep(3)
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Confirmation
            clientInfo={clientInfo}
            setClientInfo={setClientInfo}
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirm}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-semibold">Agendamento confirmado!</h2>
            <p className="text-gray-300 mt-2">Você receberá uma confirmação no WhatsApp.</p>
            <button
              onClick={() => window.location.href = `/${slug}`}
              className="mt-4 text-blue-400 underline"
            >
              Fazer novo agendamento
            </button>
          </div>
        )}
      </div>
    </div>
  )
}