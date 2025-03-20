import { Link, Outlet } from 'react-router-dom'
import { Card, Typography, List, ListItem, ListItemPrefix } from "@material-tailwind/react"
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { InboxStackIcon } from "@heroicons/react/24/outline"


const Sidebar = () => {
    const bg = "img/wp.jpg"

    return (
        <div style={{"--image-url": `url(${bg})`}} className='flex h-full bg-[image:var(--image-url)] bg-cover'>
            <Card className="h-full w-full max-w-[18rem] p-4 mr-5 shadow-xl shadow-black/40 backdrop-blur-[20px] bg-[#a1a1aa]/15 border-[1px] border-gray-800/50">
                <div className="mb-2 flex items-center gap-4 p-4">
                    <InboxStackIcon className="h-7 w-7 text-gray-500 text-red-600" />
                    <Typography variant="h5" className='text-[#f4f4f5]'>Stock system</Typography>
                </div>
                <List>
                    <Link to="/">
                        <ListItem className='text-[#f4f4f5] hover:text-black'>
                            <ListItemPrefix>
                                <UserCircleIcon className="h-5 w-5"/>
                            </ListItemPrefix>
                            <Typography>Inventario</Typography>
                            
                        </ListItem>
                    </Link>
                    <Link to="/input">
                        <ListItem className='text-[#f4f4f5] hover:text-black'>
                            <ListItemPrefix>
                                <UserCircleIcon className="h-5 w-5"/>
                            </ListItemPrefix>
                            <Typography>Registro de entradas</Typography>
                        </ListItem>
                    </Link>
                    <Link to="/output">
                        <ListItem className='text-[#f4f4f5] hover:text-black'>
                            <ListItemPrefix>
                                <UserCircleIcon className="h-5 w-5"/>
                            </ListItemPrefix>
                            <Typography>Registro de salidas</Typography>
                        </ListItem>
                    </Link>
                </List>
            </Card>
        </div>
    )
}

export default Sidebar