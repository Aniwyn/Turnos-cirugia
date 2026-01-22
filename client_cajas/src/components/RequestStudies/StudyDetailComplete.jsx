import { useEffect, useState, useRef } from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spinner,
    Chip,
    Divider,
    useDisclosure,
    Textarea,
    Tooltip,
} from "@heroui/react"
import { Eye, Check, X, Upload, FileText, SquarePen, UserRoundCheck } from "lucide-react"


const StudyDetailComplete = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()


    return (
        <>
            <Tooltip content="Marcar como completado">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="success"
                    onPress={onOpen}
                >
                    <Check size={18} />
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {actionType === 'complete' ? "Completar Estudio" : "Rechazar Estudio"}
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-sm text-default-500">
                                    {selectedItem?.study?.name}
                                </p>
                                {actionType === 'complete' ? (
                                    <div className="flex flex-col gap-4 mt-2">
                                        <div
                                            className="border-2 border-dashed border-default-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-default-100 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="w-8 h-8 text-default-400 mb-2" />
                                            <span className="text-sm text-default-600 font-medium">Click para subir archivos</span>
                                            <span className="text-xs text-default-400">Soporta múltiples archivos</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        {selectedFiles.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs font-semibold text-default-500 uppercase">Archivos seleccionados</span>
                                                <div className="flex flex-col gap-1">
                                                    {selectedFiles.map((f, i) => (
                                                        <div key={i} className="text-sm text-default-700 bg-default-100 px-3 py-2 rounded-md flex items-center gap-2">
                                                            <FileText size={16} className="text-primary" />
                                                            <span className="truncate">{f.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <Textarea
                                            label="Justificación"
                                            placeholder="Ingrese el motivo por el cual no se realizó el estudio..."
                                            value={justification}
                                            onValueChange={setJustification}
                                            variant="bordered"
                                        />
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleSubmitAction}
                                    isDisabled={actionType === 'complete' ? selectedFiles.length === 0 : !justification.trim()}
                                >
                                    Confirmar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default StudyDetailComplete