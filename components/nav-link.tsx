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
        className={`cursor-pointer hover:font-semibold ${
          path === href ? 'font-semibold border-b-2 border-blue-500 pb-1' : ''
        }`}
      >
        {children}
      </Link>
    </li>
  )
}
