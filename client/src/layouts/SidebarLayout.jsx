import { Link } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold">Clínica</h2>
        <nav>
          <ul>
            <li>
              <Link to="/" className="block py-2">Dashboard</Link>
            </li>
            <li>
              <Link to="/Appointment" className="block py-2">Registro</Link>
            </li>
            <li>
              <Link to="/Login" className="block py-2">Login</Link>
            </li>
            <li>
              <Link to="/NotFound" className="block py-2">404</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SidebarLayout;