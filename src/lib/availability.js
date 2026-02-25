import { parse, addMinutes, format } from 'date-fns'

export function generateTimeSlots(professional, selectedDate, serviceDuration, existingAppointments) {
  const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase()
  const dayConfig = professional.working_hours?.[dayOfWeek]

  console.log('Dia da semana:', dayOfWeek);
  console.log('Config do dia:', dayConfig);

  if (!dayConfig || !dayConfig.enabled) {
    console.log('Dia não configurado ou fechado');
    return [];
  }

  const startTime = dayConfig.start;
  const endTime = dayConfig.end;

  if (!startTime || !endTime) {
    console.log('Horários de início/fim não definidos');
    return [];
  }

  const start = parse(startTime, 'HH:mm', selectedDate);
  const end = parse(endTime, 'HH:mm', selectedDate);

  if (isNaN(start) || isNaN(end)) {
    console.log('Horários inválidos');
    return [];
  }

  const slots = [];
  let current = start;

  while (current < end) {
    const slotTime = format(current, 'HH:mm');
    const isBooked = existingAppointments.some(apt => apt.time === slotTime);
    if (!isBooked) {
      slots.push(slotTime);
    }
    current = addMinutes(current, serviceDuration);
  }

  console.log('Slots gerados:', slots);
  return slots;
}