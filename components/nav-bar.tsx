"use client"

import { useState } from 'react';
import NavLink from './nav-link'
import { IconMenu2, IconX } from "@tabler/icons-react"
import RippleGrid from './RippleGrid';

export default function NavBar() {

    const [menuExpanded, setMenuExpanded] = useState(false);

    function toggleBurgerMenu() {
        setMenuExpanded(!menuExpanded);
    }

    return (
        <>
        <nav className="relative flex flex-col bg-background text-card-foreground py-8 sm:shadow-sm">
            <div className="container flex justify-between items-center">

                {/* Logo */}
                <div>
                    <a href={"/"} className="text-xl uppercase tracking-wider font-bold dark:text-white">Swift Serve</a>
                </div>

                {/* Desktop */}
                <ul className="hidden md:flex justify-between gap-6 text-lg">
                    <NavLink href={"/dashboard"}>Login</NavLink>   
                </ul>

                {/* Small Screens */}
                <div className='block md:hidden'>
                    <IconMenu2 size={38} className={`cursor-pointer text-black dark:text-white ${!menuExpanded ? "block" : "hidden"}`} onClick={toggleBurgerMenu}/>
                    <IconX size={38} className={`cursor-pointer text-black dark:text-white ${menuExpanded ? "block" : "hidden"}`} onClick={toggleBurgerMenu}/>

                </div>

            </div>

            

            
        </nav>
        {menuExpanded && (
            <ul className={`flex flex-col justify-center items-center gap-8 text-lg bg-gradient-to-t from-primary/6 to-card text-card-foreground py-8`}> 
                    <NavLink href={"/dashboard"}>Login</NavLink>   
                </ul>
            )}
        </>
    )
}