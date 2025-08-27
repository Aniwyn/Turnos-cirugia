import { useEffect, useState } from "react"
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
    Tooltip,
    useDisclosure,
} from "@heroui/react"
import { NotebookPen, Pencil, DollarSign } from 'lucide-react'
import useLabelStore from '../../store/useCashMovementLabelStore'
import useCashMovementStore from '../../store/useCashMovementStore'
import { updateCashMovement } from '../../services/cashMovementService'

const ViewCashBoxDetail = ({ movement }) => {
    const [cmAmount, setCmAmount] = useState()
    const [cmCurrency, setCmCurrency] = useState("ARS")
    const [cmType, setCmType] = useState("income")
    const [cmLabel, setCmLabel] = useState()
    const [cmDescription, setCmDescription] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { labels, fetchLabels, isLoading } = useLabelStore()
    const { fetchMyActiveCashMovements } = useCashMovementStore()

    useEffect(() => {
        fetchLabels()

        if (!movement) return

        setCmAmount(movement.amount)
        setCmCurrency(movement.currency)
        setCmType(movement.type)
        setCmLabel(movement.label.key)
        setCmDescription(movement.notes)
    }, [])

    const formatter = (number) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    const handleCurrency = (e) => { setCmCurrency(e.target.value) }

    const submit = async (onClose) => {
        const selectedLabel = await labels.find(l => l.key === cmLabel)
        const newMovement = {
            type: cmType,
            amount: cmAmount,
            currency: cmCurrency,
            notes: cmDescription,
            label_id: selectedLabel.id,
        }
        await updateCashMovement(movement.id, newMovement)
        await fetchMyActiveCashMovements()

        onClose()
    }

    //hacer loading page y reemplazar
    if (isLoading) return <p>Cargando...</p>

    return (
        <>
            <Tooltip content="Editar">
                <Button isIconOnly variant="light" onPress={onOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <Pencil height={16} className="text-amber-600" />
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">Editar movimiento</ModalHeader>
                        <ModalBody>
                            <Input
                                endContent={<NotebookPen size={20} color="#a1a1ab" strokeWidth={2} />}
                                label="Descripción"
                                value={cmDescription}
                                onValueChange={setCmDescription}
                            />
                            <div className="flex justify-center py-4">
                                <span className="text-5xl pr-4">{cmCurrency == "ARS" ? "$" : "USD"}</span>
                                <span className="text-5xl font-thin" style={{ color: cmType === "expense" ? "#c10007" : "#008236" }}>{cmType == "expense" ? "-" : ""}{cmAmount ? formatter(cmAmount) : "0"}</span>
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
                                {(item) => <AutocompleteItem key={item.key}>{item.name}</AutocompleteItem>}
                            </Autocomplete>
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

export default ViewCashBoxDetail