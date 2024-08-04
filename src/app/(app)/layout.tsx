import Navbar from "@/components/ui/navbar"

const layout = ({children} : {children: React.ReactNode}) => {
    return (<>
        <Navbar />
        {children}
    </>)
}
export default layout;