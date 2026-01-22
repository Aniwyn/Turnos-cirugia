
import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@heroui/react"
import { Eye, User, Calendar, FileText } from "lucide-react"
import { capitalizeFirstLetter, formatDateFromDB, formatCurrency } from '../../tools/utils'

const BudgetDetail = ({ budget }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    if (!budget) return null

    return (
        <>
            <Button
                isIconOnly
                size="sm"
                variant="light"
                color="primary"
                onPress={onOpen}
                title="Ver detalle"
            >
                <Eye size={20} strokeWidth={1.8} />
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="4xl"
                scrollBehavior="inside"
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex justify-between items-center pe-6">
                                    <span className="text-xl">Presupuesto #{budget.id}</span>
                                    <Chip size="sm" variant="flat" color="primary">
                                        {capitalizeFirstLetter(budget.responsible_name)}
                                    </Chip>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2 p-3 bg-default-50 rounded-lg border border-default-100">
                                        <div className="flex items-center gap-2 text-primary">
                                            <User size={18} />
                                            <span className="text-xs font-bold uppercase">Paciente</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm uppercase">{budget.patient_name}</p>
                                            <p className="text-xs text-default-500">DNI: {budget.patient_dni}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 p-3 bg-default-50 rounded-lg border border-default-100">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Calendar size={18} />
                                            <span className="text-xs font-bold uppercase">Detalles</span>
                                        </div>
                                        <div className="flex justify-between items-center gap-2">
                                            <div>
                                                <p className="text-[10px] text-default-500 uppercase font-bold">Fecha</p>
                                                <p className="text-xs font-medium">{formatDateFromDB(budget.budget_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-default-500 uppercase font-bold">Destinatario</p>
                                                <p className="text-xs font-medium truncate" title={budget.recipient}>{budget.recipient}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-default-500 uppercase font-bold">Validez</p>
                                                <p className="text-xs font-medium truncate" title={budget.recipient}>{budget.validity_days} días</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {budget.extra_line && (
                                    <div className="bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg text-sm flex gap-2 items-start">
                                        <FileText size={18} className="mt-0.5 shrink-0" />
                                        <div>
                                            <span className="font-bold block text-xs uppercase mb-1">Observaciones</span>
                                            {budget.extra_line}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-2 border border-default-200 rounded-lg overflow-hidden">
                                    <Table 
                                        aria-label="Items del presupuesto" 
                                        removeWrapper 
                                        shadow="none" 
                                        isCompact 
                                        classNames={{ 
                                            th: "bg-default-100 text-default-500 font-bold", 
                                            td: "text-xs py-2" 
                                        }}
                                    >
                                        <TableHeader>
                                            <TableColumn>PRÁCTICA</TableColumn>
                                            <TableColumn align="center">OJO</TableColumn>
                                            <TableColumn align="center">CANT.</TableColumn>
                                            <TableColumn align="end">PRECIO</TableColumn>
                                            <TableColumn align="end">IVA</TableColumn>
                                            <TableColumn align="end">SUBTOTAL</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {budget.items?.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.practice_name}</TableCell>
                                                    <TableCell>{item.eye}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>$ {formatCurrency(item.price)}</TableCell>
                                                    <TableCell>{formatCurrency(item.iva)} %</TableCell>
                                                    <TableCell className="font-semibold">$ {formatCurrency(item.price * item.quantity * (1 + (item.iva / 100)))}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex justify-end items-center gap-4 py-2 px-2">
                                    <span className="text-default-500 text-sm font-medium">Total Presupuestado</span>
                                    <span className="text-2xl font-bold text-primary">$ {formatCurrency(budget.total)}</span>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default BudgetDetail