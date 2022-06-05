import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const {auth} = useAuth();
    const location= useLocation();
    debugger
    return (
       auth?.userRole?.find(allowedRoles==='student')
   
          ?<Outlet/>
          :auth?.user?
          <Navigate to="/unauthorized" state={{from:location}} replace />
          :<Navigate to="/login" state={{from:location}} replace />
    );
}

export default RequireAuth;