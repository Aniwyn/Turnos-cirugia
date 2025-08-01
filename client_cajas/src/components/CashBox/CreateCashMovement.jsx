import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    NumberInput,
    RadioGroup,
    Radio,
    useDisclosure,
} from "@heroui/react"
import { DollarSign, NotebookPen, Plus } from 'lucide-react'
import { useEffect, useState } from "react"

export const labels = [
    { label: "Deposito", key: "deposit" },
    { label: "Factura", key: "bill" },
    { label: "Personal", key: "personal" },
    { label: "Cobro", key: "collection" },
    { label: "Otro", key: "other" }
]

const CreateCashMovement = () => {
    const [cmAmount, setCmAmount] = useState()
    const [cmCurrency, setCmCurrency] = useState("ARS")
    const [cmType, setCmType] = useState("income")
    const [cmLabel, setCmLabel] = useState()
    const [cmDescription, setCmDescription] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const formatter = (number) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    const handleCurrency = (e) => { setCmCurrency(e.target.value) }

    const submit = (onClose) => {
        console.log("datos registrados (?")
        onClose()
    }

    return (
        <>
        <Button color="primary" endContent={<Plus height={20} />} onPress={onOpen}>Agregar</Button>
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Nuevo movimiento</ModalHeader>
                        <ModalBody>
                            <div className="flex justify-center pb-4">
                                <span className="text-5xl pr-4">{cmCurrency == "ARS" ? "$" : "USD"}</span>
                                <span className="text-5xl font-thin" style={{ color: cmType === "expense" ? "#c10007" : "#008236" }}>{cmType ==  "expense" ? "-" : ""}{cmAmount ? formatter(cmAmount) : "0"}</span>
                            </div>
                            <NumberInput
                                isWheelDisabled
                                label="Monto"
                                placeholder="0.00"
                                startContent={<DollarSign size={20} color="#a1a1ab" strokeWidth={2} />}
                                minValue={0}
                                value={cmAmount}
                                onValueChange={setCmAmount}
                                endContent={
                                    <div className="flex items-center">
                                        <label className="sr-only" htmlFor="currency">
                                            Currency
                                        </label>
                                        <select
                                            className="outline-hidden border-0 bg-transparent text-default-400 text-small"
                                            id="currency"
                                            name="currency"
                                            onChange={handleCurrency}
                                            value={cmCurrency}
                                        >
                                            <option aria-label="Argentine Peso" value="ARS">ARS</option>
                                            <option aria-label="US Dollar" value="USD">USD</option>
                                        </select>
                                    </div>
                                }
                            />
                            <RadioGroup orientation="horizontal" value={cmType} onValueChange={setCmType}>
                                <Radio value="income">Ingreso</Radio>
                                <Radio value="expense">Gasto</Radio>
                            </RadioGroup>
                            <Autocomplete
                                defaultItems={labels}
                                label="Etiqueta"
                                selectedKey={cmLabel}
                                onSelectionChange={setCmLabel}
                            >
                                {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                            </Autocomplete>
                            <Input
                                endContent={<NotebookPen size={20} color="#a1a1ab" strokeWidth={2} />}
                                label="Descripción"
                                value={cmDescription}
                                onValueChange={setCmDescription}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="ghost" onPress={onClose}>Cancelar</Button>
                            <Button color="primary" onPress={() => submit(onClose)}>Registrar</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
        </>
    )
}

export default CreateCashMovement