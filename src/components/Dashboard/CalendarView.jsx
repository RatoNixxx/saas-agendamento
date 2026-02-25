import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function CalendarView() {
  const [appointments, setAppointments] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('appointments')
      .select('*, services(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
    setAppointments(data || [])
  }

  const weekDays = [...Array(7)].map((_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i))

  const dayAppointments = appointments.filter(apt => 
    isSameDay(new Date(apt.date), selectedDate)
  )

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Agenda da Semana</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">Semana</button>
          <button className="px-3 py-1 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700">Dia</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
        {weekDays.map(day => (
          <div key={day.toString()} className="font-medium text-gray-300">
            {format(day, 'EEE', { locale: ptBR })}
            <div 
              className={`text-lg mt-1 cursor-pointer w-8 h-8 mx-auto flex items-center justify-center rounded-full ${
                isSameDay(day, selectedDate) 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedDate(day)}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2 text-gray-200">Agendamentos de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</h3>
        {dayAppointments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhum agendamento para este dia.</p>
        ) : (
          dayAppointments.map(apt => (
            <div key={apt.id} className="border-l-4 border-blue-500 bg-blue-900/30 p-3 mb-2 rounded">
              <p className="font-medium text-white">{apt.client_name}</p>
              <p className="text-sm text-gray-300">{apt.time} – {apt.services?.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}