import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import { EditSupplie } from "./EditSupplie";
import { AddProduct } from './AddProduct';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography } from "@material-tailwind/react";
import productsService from '../../services/productsService';

const Stock = () => {
    const [products, setProducts] = useState({data: []})
    const { alert } = useOutletContext(); 

    useEffect(() =>  {
        productsDB()
    }, [])

    const productsDB = () => {
        productsService
            .getAll()
            .then(productsDB => (setProducts(productsDB)))
            .catch(error => console.error(error))
    }

    const newAlert = async (message, color, product) => {
        alert(message, color)
        if (product) productsDB()
    }

    return (
        <div className="flex h-full w-full bg-transparent ">
            <Card className="h-full w-full shadow-xl shadow-black/40 backdrop-blur-[20px] bg-[#a1a1aa]/15 border-[1px] border-gray-800/50">
                <CardHeader floated={false} shadow={false} className="mb-2 rounded-none p-2 min-h-16 flex justify-between items-center bg-transparent">
                    <div className="w-full md:w-96 bg-black/50 rounded-lg">
                        <Input label="Buscar" color="white" icon={<MagnifyingGlassIcon className="h-5 text-white"/>}/>
                    </div>
                    <AddProduct newAlert={newAlert}/>
                </CardHeader>
                <div className="overflow-y-auto max-h-full flex">
                    <table className="mt-4 w-full min-w-max text-left text-white table-auto">
                        <thead>
                            <tr>
                                <th className="border-y border-transparent bg-black/50 p-4 w-20 cursor-default">
                                    <Typography variant="small" className="font-bold leading-none opacity-70">Cantidad</Typography>
                                </th>
                                <th className="border-y border-transparent bg-black/50 p-4 cursor-default">
                                    <Typography variant="small" className="font-bold leading-none opacity-70">Insumo</Typography>
                                </th>
                                <th className="border-y border-transparent bg-black/50 p-4 cursor-default"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map(
                            ({ id, name, quantity }, index) => {
                                const isLast = index === products.data.length - 1;
                                const classes = isLast
                                ? "px-4 py-2"
                                : "px-4 py-2 border-b border-black/50";
                
                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <div className="flex justify-center">
                                                <Typography variant="small" className="font-normal">
                                                    {quantity}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes + " w-full"}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                <Typography variant="small" className="font-normal">
                                                    {name}
                                                </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <EditSupplie nameSupplie={name} quantitySupplie={quantity} id={id} newAlert={newAlert} /> 
                                        </td>
                                    </tr>
                                );
                            },
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

export default Stock