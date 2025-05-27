import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react"

export function ConfirmDialog({ open, setOpen, title, subTitle, confirmFunction }) {
    const handleOpen = () => setOpen(!open);
    const handleConfirm = () => {
        confirmFunction()
        handleOpen()
    }

    return (
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>{title}</DialogHeader>
            <DialogBody>{subTitle}</DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={handleOpen}
                    className="mr-1"
                >
                    <span>Cancelar</span>
                </Button>
                <Button color="green" onClick={handleConfirm}>
                    <span>Confirmar</span>
                </Button>
            </DialogFooter>
        </Dialog>
    )
} //cual es la forma correcta de implementar un dialogo de confirmacion