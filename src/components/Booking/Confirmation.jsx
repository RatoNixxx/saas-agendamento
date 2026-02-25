import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Confirmation({ clientInfo, setClientInfo, service, date, time, onConfirm, onBack }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: clientInfo
  })

  const onSubmit = (data) => {
    onConfirm(data)
  }

  const formattedDate = date ? format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''

  return (
    <div>
      <button onClick={onBack} className="text-blue-400 mb-4 hover:text-blue-300 transition">← Voltar</button>
      <h2 className="text-lg font-semibold mb-4 text-white">Confirme seus dados</h2>

      <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 mb-4">
        <p className="text-gray-300"><span className="font-medium text-white">Serviço:</span> {service.name}</p>
        <p className="text-gray-300"><span className="font-medium text-white">Data:</span> {formattedDate}</p>
        <p className="text-gray-300"><span className="font-medium text-white">Horário:</span> {time}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-gray-300">Nome completo *</label>
          <input
            {...register('name', { required: 'Nome é obrigatório' })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-gray-300">E-mail</label>
          <input
            {...register('email')}
            type="email"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">WhatsApp *</label>
          <input
            {...register('phone', { required: 'Telefone é obrigatório' })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 99999-9999"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
  )
}