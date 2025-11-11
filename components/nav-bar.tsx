"use client"

import { useState } from 'react';
import Link from 'next/link'
import NavLink from './nav-link'
import { IconMenu2, IconX } from "@tabler/icons-react"

export default function NavBar() {

    const [menuExpanded, setMenuExpanded] = useState(false);

    function toggleBurgerMenu() {
        setMenuExpanded(!menuExpanded);
    }

    return (
        <>
        <nav className="flex flex-col bg-white text-black py-8 shadow-sm">
            <div className="container flex justify-between items-center">

                {/* Logo */}
                <div>
                    <p className="text-xl uppercase tracking-wider font-bold">Swift Serve</p>
                </div>

                {/* Desktop */}
                <ul className="hidden md:flex justify-between gap-6 text-lg">
                    <NavLink href={"/dashboard"}>Login</NavLink>   
                </ul>

                {/* Small Screens */}
                <div className='block md:hidden'>
                    <IconMenu2  color="black" size={38} className={`cursor-pointer  ${!menuExpanded ? "block" : "hidden"}`} onClick={toggleBurgerMenu}/>
                    <IconX  color="black" size={38} className={`cursor-pointer  ${menuExpanded ? "block" : "hidden"}`} onClick={toggleBurgerMenu}/>

                </div>

            </div>

            

            
        </nav>
        {menuExpanded && (
                <ul className={`flex flex-col justify-center items-center gap-8 text-lg bg-gray-300 text-black py-8`}> 
                    <NavLink href={"/dashboard"}>Login</NavLink>   
                </ul>
            )}
        </>
    )
}