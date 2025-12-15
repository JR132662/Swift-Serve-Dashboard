'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export default function NavLink({ href, children }: NavLinkProps) {
  const path = usePathname()

  return (
    <li>
      <Link
        href={href}
        className={`relative cursor-pointer inline-block transition-all duration-300 ${
          path === href ? 'font-semibold' : ''
        } group`}
      >
        <span className="relative z-10">{children}</span>
        {/* Amber underline that animates from right to left on hover */}
        <span 
          className="absolute bottom-0 right-0 h-0.5 bg-[#D97706] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" 
        />
        {/* Active state underline */}
        {path === href && (
          <span className="absolute bottom-0 left-0 h-0.5 bg-[#D97706] w-full" />
        )}
      </Link>
    </li>
  )
}
