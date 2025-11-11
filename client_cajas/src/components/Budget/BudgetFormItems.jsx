import { useMemo } from "react"
import { Input, Autocomplete, AutocompleteItem, Button, Select, SelectItem } from '@heroui/react'
import { DollarSign, Percent, Plus, Trash2 } from "lucide-react"

export default function BudgetFormItems({ practices, items, setItems }) {

    const total = useMemo(() => {
        return items.reduce((acc, item) => {
            const price = parseFloat(item.price) || 0
            const quantity = parseInt(item.quantity) || 0
            const iva = parseFloat(item.iva) || 0
            const subtotal = price * quantity * (1 + iva / 100)

            return acc + subtotal
        }, 0)
    }, [items])

    const addItem = () => {
        setItems([...items, { practiceId: null, quantity: 1, eye: "AO", price: 0, iva: 21 }])
    }

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index, field, value) => {
        const newItems = [...items]
        newItems[index][field] = value
        setItems(newItems)
    }

    const handlePractice = (index, key) => {
        const practice = practices.find(p => p.id.toString() === key)
        if (!practice) return

        updateItem(index, "practiceId", key)
        updateItem(index, "quantity", 1)
        updateItem(index, "price", parseFloat(practice.default_price))
    }
    
    return (
        <div className="flex flex-col gap-6 ">
            <h3 className="text-lg font-semibold">Items</h3>

            <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">Práctica</div>
                <div className="col-span-1">Cant</div>
                <div className="col-span-1">Ojo</div>
                <div className="col-span-2">Precio</div>
                <div className="col-span-1">IVA</div>
                <div className="col-span-2">Subtotal</div>
            </div>

            {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                        <Autocomplete
                            placeholder="Seleccionar práctica"
                            defaultItems={practices}
                            selectedKey={item.practiceId}
                            onSelectionChange={(key) => handlePractice(index, key)}
                            isRequired
                        >
                            {(practice) => (
                                <AutocompleteItem key={practice.id}>
                                    {practice.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>
                    </div>
                    <div className="col-span-1">
                        <Input
                            value={item.quantity}
                            onValueChange={(val) => updateItem(index, "quantity", parseInt(val) || "0")}
                            classNames={{
                                input: "text-center"
                            }}
                        />
                    </div>
                    <div className="col-span-1">
                        <Select
                            selectedKeys={[item.eye]}
                            onSelectionChange={(keys) => updateItem(index, "eye", [...keys][0])}
                        >
                            <SelectItem key="OD">OD</SelectItem>
                            <SelectItem key="OI">OI</SelectItem>
                            <SelectItem key="AO">AO</SelectItem>
                        </Select>
                    </div>
                    <div className="col-span-2">
                        <Input
                            value={item.price || 0}
                            onValueChange={(val) => { updateItem(index, "price", val)}}
                            onBlur={() => {
                                const normalized = (item.price || "").replace(",", ".")
                                const num = parseFloat(normalized)
                                updateItem(index, "price", isNaN(num) ? "" : num.toFixed(2))
                            }}
                            startContent={<DollarSign strokeWidth={0.75} size={16} />}
                            classNames={{
                                input: "text-right"
                            }}
                        />
                    </div>
                    <div className="col-span-1">
                        <Input
                            value={item.iva || 0}
                            onValueChange={(val) => updateItem(index, "iva", val)}
                            onBlur={() => updateItem(index, "iva", isNaN(parseFloat(item.iva)) ? 0 : parseFloat(item.iva).toFixed(1))}
                            endContent={<Percent strokeWidth={0.75} size={20} />}
                            classNames={{
                                input: "text-center"
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            value={(item.price * item.quantity * (1 + item.iva / 100)).toFixed(2) || "0"}
                            startContent={<DollarSign strokeWidth={0.75} size={16} />}
                            classNames={{
                                input: "text-right"
                            }}
                        />
                    </div>
                    <div className="col-span-1 flex justify-center h-full items-end">
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => removeItem(index)}
                        >
                            <Trash2 size={20} strokeWidth={0.75} />
                        </Button>
                    </div>
                </div>
            ))}

            <div>
                <Button
                    startContent={<Plus size={18} />}
                    onPress={addItem}
                    color="primary"
                    variant="light"
                >
                    Agregar práctica
                </Button>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-9"></div>
                <div className="col-span-2">
                    <Input
                        label="Total"
                        labelPlacement="outside"
                        value={total.toFixed(2)}
                        startContent={<DollarSign strokeWidth={0.75} size={16} />}
                        classNames={{
                            input: "text-right"
                        }}
                        disabled
                    />
                </div>
            </div>
        </div>
    )
}