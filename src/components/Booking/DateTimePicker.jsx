import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { generateTimeSlots } from '../../lib/availability'
import { format, addDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DateTimePicker({ professional, service, onSelectDateTime, onBack }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [existingAppointments, setExistingAppointments] = useState([])
  const [dates, setDates] = useState([])

  useEffect(() => {
    const today = new Date()
    today.setHours(0,0,0,0)
    const nextDays = []
    for (let i = 0; i < 14; i++) {
      const day = addDays(today, i)
      nextDays.push(format(day, 'yyyy-MM-dd'))
    }
    setDates(nextDays)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAppointmentsForDate(selectedDate)
    }
  }, [selectedDate])

  async function fetchAppointmentsForDate(dateStr) {
    const { data } = await supabase
      .from('appointments')
      .select('time')
      .eq('user_id', professional.id)
      .eq('date', dateStr)
    setExistingAppointments(data || [])
  }

  useEffect(() => {
    if (selectedDate && service) {
      const dateObj = parseISO(selectedDate)
      const slots = generateTimeSlots(professional, dateObj, service.duration, existingAppointments)
      setAvailableTimes(slots)
    }
  }, [selectedDate, service, existingAppointments])

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelectDateTime(selectedDate, selectedTime)
    }
  }

  return (
    <div>
      <button onClick={onBack} className="text-blue-400 mb-4 hover:text-blue-300 transition">← Voltar</button>
      <h2 className="text-lg font-semibold mb-4 text-white">Escolha data e horário</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-300">Data</label>
        <select
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          value={selectedDate || ''}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="" className="bg-gray-800">Selecione uma data</option>
          {dates.map(dateStr => (
            <option key={dateStr} value={dateStr} className="bg-gray-800">
              {format(parseISO(dateStr), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Horário</label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 border rounded-lg transition ${
                  selectedTime === time 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {availableTimes.length === 0 && (
            <p className="text-gray-400 text-center py-4">Nenhum horário disponível nesta data.</p>
          )}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
      >
        Continuar
      </button>
    </div>
  )
}