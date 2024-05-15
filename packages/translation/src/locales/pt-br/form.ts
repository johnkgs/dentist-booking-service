export default {
  actions: {
    remove: "Remover",
    cancel: "Cancelar",
    save: "Salvar",
    add: "Adicionar",
    enable_notifications: "Ativar notificações",
    mark_all_as_read: "Marcar tudo como lido",
    call: "Chamar",
    call_patient: "Chamar paciente",
    finish_appointment: "Finalizar atendimento"
  },
  labels: {
    new_schedule: "Novo atendimento",
    new_appointment: "Novo agendamento",
    appointment: "Atendimento",
    scheduling: "Agendamento",
    patient: "Paciente",
    patients: "Pacientes",
    doctor: "Médico",
    doctors: "Médicos",
    doctor_assistant: "Médico assistente",
    room: "Sala",
    status: "Status",
    actions: "Ações",
    name: "Nome",
    id: "ID",
    date: "Data",
    email: "E-mail",
    phone: "Telefone"
  },
  placeholders: {
    search: "Buscar {field}...",
    select: "Selecionar {field}..."
  },
  descriptions: {
    please_go_to_room: "Por favor, prosseguir para a sala: {room}.",
    schedule_at: "{startDate} até {endDate}",
    schedule_full_at: "${startDate} - {startTime} até {endTime}"
  },
  validation_errors: {
    required: "Campo obrigatório"
  },
  errors: {
    empty: "Nenhum {field} encontrado."
  }
} as const
