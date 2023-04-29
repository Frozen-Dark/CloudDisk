import {LOGIN_ROUTE, REGISTRATION_ROUTE, DISK_ROUTE} from "./utils/consts"
import MobileDisk from "./pages/MobileDisk";
import Auth from "./pages/Auth";
export const authRoutes = [
    {
        path: DISK_ROUTE,
        Component: MobileDisk
    },
    {
        path: "",
        Component: MobileDisk
    },
]

export const publicRoutes = [
    {
      path: REGISTRATION_ROUTE,
      Component: Auth
    },
    {
      path: LOGIN_ROUTE,
      Component: Auth
    },
    {
      path: "",
      Component: Auth
    },
]