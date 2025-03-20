import { useState } from 'react'
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Input, Typography } from "@material-tailwind/react";
import productsService from '../../services/productsService';

export const AddProduct = ({ newAlert }) => {
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState({name: "", quantity: "", state: "error"});
    const handleOpen = () => setOpen((cur) => !cur);

    const handleChangeName = (e) => { setProduct({...product, name: e.target.value}) }
    const handleChangeQuantity = (e) => { setProduct({...product, quantity: e.target.value}) }

    const handleConfirmOperation = async () => {
        let message
        let color
        if (product.name != "" && product.quantity != "") {
            const newProduct = {...product, state: "active"}
            await productsService.addProduct(newProduct)
            color = "green"
            message = "Producto agregado exitosamente."
            newAlert(message, color, newProduct)
        } else {
            message = "Los datos no pueden estar vacios."
            color = "red"
            newAlert(message, color, {})
        }
        setOpen(false)
    }

    return (
    <>
    <IconButton className="rounded-full bg-black/50 hover:bg-white/70 hover:text-black" onClick={handleOpen}>
        <PlusIcon className="h-6 w-6"/>
    </IconButton>
    <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
    >
        <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
                <Typography variant="h4" color="blue-gray">Ingreso</Typography>
                <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
                    Datos del producto / insumo.
                </Typography>
                <Input label="Nombre" size="lg" value={product.name} onChange={handleChangeName}/>
                <Input label="Cantidad" size="lg" value={product.quantity} onChange={handleChangeQuantity}/>
            </CardBody>
          <CardFooter className="pt-0">
                <Button variant="outlined" onClick={handleOpen} className='mb-3' fullWidth>Cancelar</Button>
                <Button variant="gradient" color="light-green" onClick={handleConfirmOperation} fullWidth>Aceptar</Button>
          </CardFooter>
        </Card>
    </Dialog>
    </>
    )
}