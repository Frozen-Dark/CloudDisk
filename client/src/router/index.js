import Counter from "../components/Counter";

export const privatePages = [
    {path:'/', element: <Counter/>, exact: true},
    {path:'/login', element: <Counter/>, exact: true},
    {path:'/disk', element: <Counter/>, exact: true},
    {path:'/home', element: <Counter/>, exact: true},
    {path:'/about', element: <Counter/>, exact: true},
    {path:'/*', element: <Counter/>, exact: true},
]

export const publickPages = [
    {path:'/login', element: <Counter/>, exact: true},
    {path:'/*', element: <Counter/>, exact: true},
]