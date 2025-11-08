
'use client'
 
import { usePathname } from 'next/navigation'

import Link from 'next/link'

export default function NavLink({ href, children }) {
    const path = usePathname();
    console.log("Path = ", path);

    return (
        <li>
            <Link
                href={href}
                className={`cursor-pointer hover:font-semibold ${path === href && "font-semibold border-b-2 border-blue-500 pb-1"}`}
            >
            {children}
            </Link>
        </li>
    )
}