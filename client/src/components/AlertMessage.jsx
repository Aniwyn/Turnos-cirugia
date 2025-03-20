import { Alert } from "@material-tailwind/react";

export const AlertMessage = ({ color, text, showAlert }) => {

    return(
        <Alert
            color={color}
            className='absolute bottom-3 right-3 w-2/5 h-10 py-2 px-4'
            open={showAlert}
        >
            {text}
        </Alert>
    )
}