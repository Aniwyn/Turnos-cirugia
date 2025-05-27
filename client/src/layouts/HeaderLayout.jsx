import { Avatar, Typography } from "@material-tailwind/react";

const HeaderLayout = ({ children }) => {
  return (
    <div className='flex flex-col w-full'>
      <header className="flex justify-between content-center py-2 px-8">
        <Typography className='bg-gradient-to-r from-green-700 to-teal-500 bg-clip-text text-transparent content-center' variant='h3'>Clínica de Ojos Jujuy</Typography>
        {/*<div className="flex items-center gap-4">
            <div className="text-right">
                <Typography variant="h6">Norma</Typography>
                <Typography variant="small" color="gray" className="font-normal">
                    Administrativo
                </Typography>
            </div>
            <Avatar src="https://cdn.pixabay.com/photo/2024/11/11/14/34/parakeets-9190236_960_720.jpg" size='md' />
        </div>*/}
      </header>
      <div className="flex-1 px-6 max-h-[100vh]">{children}</div>
    </div>
  );
};

export default HeaderLayout;