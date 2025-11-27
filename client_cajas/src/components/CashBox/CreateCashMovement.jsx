import { useEffect, useState } from "react"
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Input,
    Form,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    NumberInput,
    RadioGroup,
    Radio,
    useDisclosure
} from "@heroui/react"
import { DollarSign, NotebookPen, Plus } from 'lucide-react'
import useCashMovementStore from '../../store/useCashMovementStore'
import useCashBoxStore from '../../store/useCashBoxStore'
import useLabelStore from '../../store/useCashMovementLabelStore'
import { createCashMovement } from '../../services/cashMovementService'

const CreateCashMovement = ({ boxId, setMovements }) => {
    const [cmAmount, setCmAmount] = useState()
    const [cmCurrency, setCmCurrency] = useState("ARS")
    const [cmType, setCmType] = useState("income") //o expense
    const [cmLabel, setCmLabel] = useState()
    const [cmDescription, setCmDescription] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { fetchMyActiveCashMovements } = useCashMovementStore()
    const { fetchMyActiveCashBox, isLoadingCashBoxStore, errorCashBoxStore } = useCashBoxStore()
    const { labels, fetchLabels, isLoading } = useLabelStore()
    const errors = {}

    useEffect(() => {
        if (isOpen) {
            fetchLabels()
            setCmAmount(null)
            setCmCurrency("ARS")
            setCmType("income")
            setCmLabel(null)
            setCmDescription("")
        }
    }, [isOpen])

    const formatter = (number) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    const filteredLabels = () => {
        return (labels || []).filter(label => label.movement_type === cmType)
    }

    const handleCurrency = (e) => { setCmCurrency(e.target.value) }
    
    const handleType = (e) => {
        setCmLabel(null)
        setCmType(e)
    }

    const onSubmit = async (e, onClose) => {
        e.preventDefault()
        const selectedLabel = await labels.find(l => l.key === cmLabel)
        const newMovement = {
            cash_box_id: boxId,
            type: cmType,
            amount: cmAmount,
            currency: cmCurrency,
            notes: cmDescription,
            label_id: selectedLabel.id,
        }
        await createCashMovement(newMovement)
        const box = await fetchMyActiveCashBox()
        const movements = await fetchMyActiveCashMovements(box.id)
        setMovements(movements)

        onClose()
    }

    return (
        <>
            <Button 
                className="bg-gradient-to-tr from-emerald-600 to-lime-500 text-white"
                startContent={<Plus height={20} />}
                onPress={onOpen}
            >
                <span className="w-full">Agregar</span>
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop="blur" isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Nuevo movimiento</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full justify-center items-center space-y-4"
                                    validationErrors={errors}
                                    onSubmit={(e) => onSubmit(e, onClose)}
                                >
                                    <Input
                                        isRequired
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
                                        isRequired
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

                                    <RadioGroup isRequired orientation="horizontal" value={cmType} onValueChange={handleType}>
                                        <Radio value="income">Ingreso</Radio>
                                        <Radio value="expense">Gasto</Radio>
                                    </RadioGroup>
                                    <Autocomplete
                                        isRequired
                                        defaultItems={filteredLabels()}
                                        label="Etiqueta"
                                        selectedKey={cmLabel}
                                        onSelectionChange={setCmLabel}
                                    >
                                        {(item) => <AutocompleteItem key={item.key}>{item.name}</AutocompleteItem>}
                                    </Autocomplete>
                                    <div className="flex w-full gap-2 justify-end items-end my-4">
                                        <Button color="default" variant="ghost" onPress={onClose}>Cancelar</Button>
                                        <Button color="primary" type="submit">Registrar</Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateCashMovement