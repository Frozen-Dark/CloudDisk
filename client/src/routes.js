import {LOGIN_ROUTE, REGISTRATION_ROUTE, DISK_ROUTE, SETTINGS_ROUTE, HOME_ROUTE, SHARE_ROUTE} from "./utils/consts"
import MobileDisk from "./pages/MobileDisk";
import HomePage from "./pages/HomePage";
import ShareFiles from "./pages/ShareFiles";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
export const authRoutes = [
    {
        path: DISK_ROUTE,
        Component: MobileDisk
    }
    ,{
        path: SETTINGS_ROUTE,
        Component: Settings
    },
    {
        path: HOME_ROUTE,
        Component: HomePage
    },
    {
        path: SHARE_ROUTE,
        Component: ShareFiles
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