import { ReactNode } from "react"
import NavBar from "./nav-bar"
import Footer from "./footer"

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <NavBar />
            <main>{children}</main>
            <Footer />
        </>
    )
}