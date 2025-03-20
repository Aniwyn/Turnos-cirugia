import React from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import productsService from '../../services/productsService';

export const EditSupplie = ({ nameSupplie, quantitySupplie, id, newAlert }) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(nameSupplie);
    const [quantity, setQuantity] = React.useState(quantitySupplie);

    const handleOpen = () => setOpen((cur) => !cur);
    const handleName = (i) => { setName(i.target.value) }
    const handleQuantity = (i) => { setQuantity(i.target.value) }
    const handleUpdateOperation = async () =>  {
        let message = "Producto actualizado exitosamente."
        let color = "green"
        const updateProduct = {name: name, quantity: quantity, id: id}
        const respose = await productsService.updateProduct(updateProduct)
        if (respose.data.meta.status) {
            newAlert(message, color, updateProduct)
        } else {
            message = "Ha ocurrido un error inesperado."
            color = "red"
            newAlert(message, color, {})
        }
        setOpen(false)
    }

    const handleDeleteOperation = async () =>  {
        let message = "Producto eliminado exitosamente."
        let color = "orange"
        const deleteProduct = {id: id}

        const respose = await productsService.deleteProduct(deleteProduct)
        console.log("BBBB", respose.data.meta.status)
        if (respose.data.meta.status && respose.data.meta.status == 200) {
            newAlert(message, color, {})
        } else {
            message = "Ha ocurrido un error inesperado."
            color = "red"
            newAlert(message, color, {})
        }
        setOpen(false)
    }

    return (
        <div className="flex justify-end w-full">
            <IconButton onClick={handleOpen} variant="text" className="rounded-full text-white hover:bg-black/50">
                <PencilIcon className="h-4 w-5"/>
            </IconButton>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem] ">
                <CardBody className="flex flex-col gap-4">
                    <div className="flex justify-between content-center">
                        <Typography variant="h4" color="blue-gray">Editar insumo</Typography>
                        <IconButton variant="text" className="w-8 h-8" onClick={handleDeleteOperation}>
                            <TrashIcon className="h-5 w-5 text-red-500"/>
                        </IconButton>
                    </div>
                    <Typography className="-mb-2" variant="h6">Cambiar nombre</Typography>
                    <Input label="Nombre" size="lg" value={name} onChange={handleName}/>
                    <Typography className="-mb-2" variant="h6">Nueva cantidad</Typography>
                    <Input label="Cantidad" size="lg" value={quantity} onChange={handleQuantity}/>
                </CardBody>
                <CardFooter className="pt-0 pb-3">
                    <Button onClick={handleOpen} fullWidth color="gray" variant="outlined">Cancelar</Button>
                </CardFooter>
                <CardFooter className="pt-0">
                    <Button variant="gradient" onClick={handleUpdateOperation} fullWidth color="light-green">Aceptar</Button>
                </CardFooter>
                </Card>
            </Dialog>
        </div>
    );
}