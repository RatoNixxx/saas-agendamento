import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ScheduleConfig from './ScheduleConfig'
import CalendarView from './CalendarView'
import ClientList from './ClientList'
import UniqueLink from './UniqueLink'
import { Cog6ToothIcon, CalendarIcon, UserGroupIcon, LinkIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    fetchProfile()
    
    // Verificar se veio de pagamento bem-sucedido
    const params = new URLSearchParams(location.search)
    if (params.get('success') === 'true') {
      alert('✅ Assinatura realizada com sucesso! Seu plano já está ativo.')
      // Remove o parâmetro da URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [location])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (!error) setProfile(data)
    }
    setLoading(false)
  }

  async function updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      if (!error) setProfile({ ...profile, ...updates })
    }
  }

  if (loading) return <div className="text-center p-8 text-white">Carregando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Painel do Profissional</h1>
        
        {/* Configuração de WhatsApp e Link Único em cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10">
            <label className="block text-sm font-medium mb-2">WhatsApp para notificações</label>
            <input
              type="tel"
              value={profile?.whatsapp || ''}
              onChange={(e) => updateProfile({ whatsapp: e.target.value })}
              placeholder="(11) 99999-9999"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <UniqueLink slug={profile?.unique_slug} onUpdate={(newSlug) => setProfile({...profile, unique_slug: newSlug})} />
        </div>

        {/* Navegação interna com ícones */}
        <div className="flex space-x-4 mb-6 border-b border-white/10 pb-2 overflow-x-auto">
          <Link to="/dashboard" className="flex items-center space-x-1 px-3 py-2 hover:text-blue-400 transition">
            <CalendarIcon className="w-5 h-5" />
            <span>Agenda</span>
          </Link>
          <Link to="/dashboard/config" className="flex items-center space-x-1 px-3 py-2 hover:text-blue-400 transition">
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Horários</span>
          </Link>
          <Link to="/dashboard/services" className="flex items-center space-x-1 px-3 py-2 hover:text-blue-400 transition">
            <LinkIcon className="w-5 h-5" />
            <span>Serviços</span>
          </Link>
          <Link to="/dashboard/clients" className="flex items-center space-x-1 px-3 py-2 hover:text-blue-400 transition">
            <UserGroupIcon className="w-5 h-5" />
            <span>Clientes</span>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<CalendarView />} />
          <Route path="/config" element={<ScheduleConfig profile={profile} updateProfile={updateProfile} />} />
          <Route path="/services" element={<ServiceManager />} />
          <Route path="/clients" element={<ClientList />} />
        </Routes>
      </div>
    </div>
  )
}

// Componente interno para gerenciar serviços
function ServiceManager() {
  const [services, setServices] = useState([])
  const [newService, setNewService] = useState({ name: '', duration: 30, price: '' })

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id)
    setServices(data || [])
  }

  async function addService() {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('services')
      .insert([{ ...newService, user_id: user.id }])
    if (!error) {
      fetchServices()
      setNewService({ name: '', duration: 30, price: '' })
    }
  }

  return (
    <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Serviços Oferecidos</h2>
      <div className="space-y-2 mb-4">
        {services.map(s => (
          <div key={s.id} className="flex justify-between p-3 bg-gray-800/50 rounded-lg">
            <span>{s.name} ({s.duration} min)</span>
            <span className="text-blue-400">R$ {s.price}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-4">
        <h3 className="font-medium mb-2">Adicionar Serviço</h3>
        <input
          type="text"
          placeholder="Nome do serviço"
          value={newService.name}
          onChange={e => setNewService({ ...newService, name: e.target.value })}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2"
        />
        <div className="flex space-x-2 mb-2">
          <input
            type="number"
            placeholder="Duração (min)"
            value={newService.duration}
            onChange={e => setNewService({ ...newService, duration: parseInt(e.target.value) })}
            className="w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />
          <input
            type="number"
            placeholder="Preço"
            value={newService.price}
            onChange={e => setNewService({ ...newService, price: e.target.value })}
            className="w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>
        <button
          onClick={addService}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}