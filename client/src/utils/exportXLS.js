import * as XLSX from 'xlsx'

export const exportAppointmentsToExcel = (appointments) => {
    const excelData = appointments.map(appt => {
        const surgery = appt.Surgeries[0] || {}
        const eye = surgery.appointment_surgery?.eye || ''
        const lens = surgery.appointment_surgery?.intraocular_lens || ''
        const surgeryName = surgery.name || ''
        const medic = appt.Patient.Medic?.name || ''
        const nurse = appt.MedicalUser?.name || ''

        return {
            'HORA': appt.surgery_time?.slice(0, 5) || '',
            'APELLIDO Y NOMBRE': `${appt.Patient.last_name} ${appt.Patient.first_name}`,
            'OJO': eye,
            'CIRUGIA': surgeryName,
            'MEDICO': medic,
            'OS': appt.Patient.health_insurance || '',
            'TEL 1': appt.Patient.phone1,
            'FECHA': appt.surgery_date || '',
            'OBSERVACION': lens,
            'ATENDIO': nurse
        }
    })

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    worksheet['!cols'] = [
        { wch: 6 }, // HORA
        { wch: 20 }, // APELLIDO Y NOMBRE
        { wch: 4 }, // OJO
        { wch: 14 }, // CIRUGIA
        { wch: 15 }, // MEDICO
        { wch: 6 }, // OBRA SOCIAL
        { wch: 12 }, // TEL 1
        { wch: 10 }, // FECHA
        { wch: 20 }, // OBSERVACIONES (lente)
        { wch: 7 } // ATENDIO
    ]
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Turnos')

    XLSX.writeFile(workbook, 'turnos.xlsx')
}
