import Navbar from "@/components/ui/navbar"

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Navbar/>
            <div className="mt-16">
                {children}
            </div>
        </>
    )
}

export default Layout;