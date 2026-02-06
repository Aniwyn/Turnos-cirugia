import { Autocomplete, AutocompleteItem, Button, DateInput, Input, Textarea } from '@heroui/react'
import { Search } from 'lucide-react'

const PatientForm = ({
    patient,
    idAbacus, setIdAbacus,
    dni, setDNI,
    lastName, setLastName,
    firstName, setFirstName,
    birthDate, setBirthDate,
    email, setEmail,
    healthInsuranceId, setHealthInsuranceID,
    medicId, setMedicID,
    notes, setNotes,
    isFormLocked,
    searchAbacusPatient,
    healthInsurances,
    medics
}) => {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            searchAbacusPatient(e)
        }
    }

    return (
        <div className="flex flex-col col-span-2 gap-4">
            <div className="flex items-end gap-2">
                <Input
                    isDisabled={dni}
                    label="ID Abacus"
                    labelPlacement="outside"
                    placeholder="12345"
                    color="primary"
                    variant="faded"
                    value={idAbacus}
                    onValueChange={setIdAbacus}
                    onKeyDown={handleKeyDown}
                    className="max-w-22"
                />
                <Input
                    isDisabled={idAbacus}
                    label="DNI"
                    labelPlacement="outside"
                    name="dni"
                    placeholder="DNI del paciente"
                    color="primary"
                    variant="faded"
                    value={dni}
                    onValueChange={setDNI}
                    onKeyDown={handleKeyDown}
                    isClearable={false}
                />
                {!patient &&
                    <Button
                        onPress={searchAbacusPatient}
                        isIconOnly color="primary"
                    >
                        <Search size={20} />
                    </Button>
                }
            </div>
            <div className="flex items-end gap-2">
                <Input
                    isRequired
                    label="Apellido/s"
                    labelPlacement="outside"
                    name="last_name"
                    placeholder="Apellido/s del paciente"
                    value={lastName}
                    onValueChange={setLastName}
                    isDisabled
                />
                <Input
                    isRequired
                    label="Nombre/s"
                    labelPlacement="outside"
                    name="first_name"
                    placeholder="Nombre/s del paciente"
                    value={firstName}
                    onValueChange={setFirstName}
                    isDisabled
                />
            </div>
            <div className="flex gap-2 items-end">
                <DateInput
                    value={birthDate}
                    onChange={setBirthDate}
                    isDisabled
                    label="Fecha de nacimiento"
                    labelPlacement="outside"
                    className="max-w-40"
                />
                <Input
                    label="Correo electrónico"
                    labelPlacement="outside"
                    name="email"
                    type="email"
                    placeholder="Email del paciente"
                    value={email}
                    onValueChange={setEmail}
                    isDisabled={isFormLocked}
                />
            </div>
            <div className="flex items-end gap-2">
                <Autocomplete
                    isRequired
                    label="Obra social"
                    labelPlacement="outside"
                    placeholder="Obra social"
                    defaultItems={healthInsurances}
                    selectedKey={healthInsuranceId ? String(healthInsuranceId) : null}
                    onSelectionChange={(key) => setHealthInsuranceID(key ? Number(key) : null)}
                    isDisabled={isFormLocked}
                >
                    {(healthInsurance) => (
                        <AutocompleteItem key={healthInsurance.abacus_id}>
                            {healthInsurance.name}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
                <Autocomplete
                    isRequired
                    label="Médico"
                    labelPlacement="outside"
                    placeholder="Médico"
                    defaultItems={medics}
                    selectedKey={medicId ? String(medicId) : null}
                    onSelectionChange={(key) => setMedicID(key ? Number(key) : null)}
                    isDisabled={isFormLocked}
                >
                    {(medic) => (
                        <AutocompleteItem key={medic.id}>
                            {medic.name}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </div>
            <Textarea
                label="Notas"
                labelPlacement="outside"
                name="notes"
                placeholder="Notas"
                value={notes}
                onValueChange={setNotes}
                isDisabled={isFormLocked}
            />
        </div>
    )
}

export default PatientForm