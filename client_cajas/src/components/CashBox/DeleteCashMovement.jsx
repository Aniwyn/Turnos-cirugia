import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  useDisclosure,
} from "@heroui/react"
import { Trash2 } from 'lucide-react'

const DeleteCashMovement = ({ movement }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const formatter = (number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number)
  }

  return (
    <>
      <Tooltip color="danger" content="Eliminar">
        <Button isIconOnly variant="light" onPress={onOpen} className="text-lg text-danger cursor-pointer active:opacity-50">
          <Trash2 height={16} />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="border-3 border-red-600">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">¿Esta seguro/a que desea eliminar este item?</ModalHeader>
              <ModalBody>
                <div className="flex justify-center">
                  <span className="text-4xl pr-4">{movement.currency == "ARS" ? "$" : "USD"}</span>
                  <span className="text-4xl font-thin" style={{ color: movement.type === "expense" ? "#c10007" : "#008236" }}>{movement.type == "expense" ? "-" : ""}{movement.amount ? formatter(movement.amount) : "0"}</span>
                </div>
                <p className="text-center">{movement.notes}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>Cerrar</Button>
                <Button color="danger" onPress={onClose}>Eliminar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteCashMovement