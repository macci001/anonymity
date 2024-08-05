import Navbar from "@/components/ui/navbar"

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}

export default Layout;