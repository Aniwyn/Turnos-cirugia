import { createBrowserRouter } from "react-router-dom";
import Sidebar from './components/Sidebar'
import Main from './components/Main';
import Input from './components/Input/Input';
import Output from './components/Output/Output';
import Stock from "./components/Stock/Stock";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          index:true,
          path: "",
          element:<Stock/>
        },
        {
          path: "input",
          element:<Input/>
        },
        {
          path: "output",
          element:<Output/>
        },
      ]
    }
]);


export default router