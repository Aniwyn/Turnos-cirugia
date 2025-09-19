import { useState } from "react"
import {
    Button,
    Input,
    Form,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Select,
    SelectItem,
    useDisclosure
} from "@heroui/react"
import { DollarSign, Plus } from 'lucide-react'
import usePracticeStore from "../../store/usePracticeStore"

const CreatePractice = () => {
    const [name, setName] = useState("")
    const [code, setCode] = useState("")
    const [module, setModule] = useState("")
    const [type, setType] = useState("")
    const [price, setPrice] = useState()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { createPractice, fetchPractices, isLoadingPracticeStore, errorPracticeStore } = usePracticeStore()
    const errors = {}

    const types = [
        { key: "unilateral", label: "Unilateral" },
        { key: "bilateral", label: "Bilateral" }
    ]

    const onSubmit = async (e, onClose) => {
        e.preventDefault()
        const practice = { name, code, module, type: type.currentKey, default_price: price }
        await createPractice(practice)

        setName("")
        setCode("")
        setModule("")
        setType("")
        setPrice()

        onClose()
    }

    return (
        <>
            <Button color="primary" endContent={<Plus height={20} />} onPress={onOpen}>Agregar</Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Nueva Practica</ModalHeader>
                            <ModalBody>
                                <Form
                                    validationErrors={errors}
                                    onSubmit={(e) => onSubmit(e, onClose)}
                                >
                                    <Input
                                        label="Nombre"
                                        labelPlacement="outside"
                                        placeholder="Nombre"
                                        isRequired
                                        value={name}
                                        onValueChange={setName}
                                    />
                                    <Input
                                        hideStepper
                                        isRequired
                                        startContent={<DollarSign strokeWidth={0.75} size={16} />}
                                        label="Valor"
                                        labelPlacement="outside"
                                        value={price || 0}
                                        onValueChange={(n) => setPrice(n)}
                                        onBlur={() => {
                                            const normalized = (price || "").replace(",", ".")
                                            const num = parseFloat(normalized)
                                            setPrice(isNaN(num) ? "" : num.toFixed(2))
                                        }}
                                        classNames={{
                                            input: "text-right"
                                        }}
                                    />
                                    <div className="flex gap-4">
                                        <Input
                                            label="Modulo"
                                            labelPlacement="outside"
                                            placeholder="Modulo"
                                            value={module}
                                            onValueChange={setModule}
                                        />
                                        <Input
                                            label="Código"
                                            labelPlacement="outside"
                                            placeholder="Código"
                                            value={code}
                                            onValueChange={setCode}
                                        />
                                    </div>
                                    <Select
                                        label="Tipo"
                                        labelPlacement="outside"
                                        placeholder="Tipo"
                                        selectedKeys={type}
                                        onSelectionChange={setType}
                                    >
                                        {types.map((typePractice) => (
                                            <SelectItem key={typePractice.key}>{typePractice.label}</SelectItem>
                                        ))}
                                    </Select>
                                    <div className="flex gap-2 w-full my-4 justify-end">
                                        <Button color="default" variant="ghost" onPress={onClose} disabled={isLoadingPracticeStore}>Cancelar</Button>
                                        <Button color="primary" type="submit" disabled={isLoadingPracticeStore}>Agregar</Button>
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

export default CreatePractice