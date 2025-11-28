"use client"

import React, { useMemo, useState } from "react"
import Layout from "@/components/layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?`~]).{8,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Accept exactly 10 digits (numbers only)
const phoneRegex = /^\d{10}$/

function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 10)
  if (d.length === 0) return ""
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?`~]/.test(password),
      full: passwordRegex.test(password),
    }
  }, [password])

  const normalizedEmail = email.trim()
  const normalizedConfirmEmail = confirmEmail.trim()
  const emailValid = normalizedEmail !== "" ? emailRegex.test(normalizedEmail) : false
  const emailsMatch = normalizedEmail !== "" && normalizedEmail.toLowerCase() === normalizedConfirmEmail.toLowerCase()
  const passwordsMatch = password !== "" && password === confirmPassword
  const normalizedPhone = phone.trim()
  const phoneValid = phoneRegex.test(normalizedPhone)

  const canSubmit =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    emailValid &&
    emailsMatch &&
    phoneValid &&
    passwordsMatch &&
    passwordChecks.full

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    // Replace with actual submit logic (API call)
    alert("Signup successful (demo). Replace with real API call.")
  }

  return (
    <Layout>
      <Card className="mx-auto w-full max-w-2xl my-8">
        <CardHeader>
          <CardTitle className="text-3xl">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2" htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-2" htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={formatPhone(phone)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10)
                setPhone(digits)
              }}
              placeholder="(555) 555-5555"
              maxLength={14}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="mb-2" htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <div className="mt-2 text-sm">
                {email !== "" && !emailValid ? (
                  <span className="flex items-center gap-2 text-destructive">
                    <XIcon /> Enter a valid email
                  </span>
                ) : null}
              </div>
            </div>
            <div>
              <Label className="mb-2" htmlFor="confirmEmail">Confirm Email</Label>
              <Input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirm email"
                required
              />

              <div className="mt-2 flex items-center gap-2 text-sm">
                {confirmEmail !== "" ? (
                  !emailValid ? (
                    <span className="flex items-center gap-2 text-destructive">
                      <XIcon /> Enter a valid email
                    </span>
                  ) : emailsMatch ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckIcon /> Emails match
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-destructive">
                      <XIcon /> Emails do not match
                    </span>
                  )
                ) : null}
              </div>
            </div>
          </div>

          

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="mb-2" htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />

              <div className="mt-3 rounded-md border border-border p-3 text-sm">
                <div className="mb-2 font-medium">Password must contain:</div>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    {passwordChecks.length ? (
                      <span className="text-green-600"><CheckIcon /></span>
                    ) : (
                      <span className="text-muted-foreground"><XIcon /></span>
                    )}
                    <span className={passwordChecks.length ? "text-slate-700" : "text-muted-foreground"}>
                      At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.uppercase ? (
                      <span className="text-green-600"><CheckIcon /></span>
                    ) : (
                      <span className="text-muted-foreground"><XIcon /></span>
                    )}
                    <span className={passwordChecks.uppercase ? "text-slate-700" : "text-muted-foreground"}>
                      At least one uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.lowercase ? (
                      <span className="text-green-600"><CheckIcon /></span>
                    ) : (
                      <span className="text-muted-foreground"><XIcon /></span>
                    )}
                    <span className={passwordChecks.lowercase ? "text-slate-700" : "text-muted-foreground"}>
                      At least one lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.number ? (
                      <span className="text-green-600"><CheckIcon /></span>
                    ) : (
                      <span className="text-muted-foreground"><XIcon /></span>
                    )}
                    <span className={passwordChecks.number ? "text-slate-700" : "text-muted-foreground"}>
                      At least one number
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.special ? (
                      <span className="text-green-600"><CheckIcon /></span>
                    ) : (
                      <span className="text-muted-foreground"><XIcon /></span>
                    )}
                    <span className={passwordChecks.special ? "text-slate-700" : "text-muted-foreground"}>
                      At least one special character
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <Label className="mb-2" htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />

              <div className="mt-2 text-sm">
                {confirmPassword !== "" ? (
                  passwordsMatch ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckIcon /> Passwords match
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-destructive">
                      <XIcon /> Passwords do not match
                    </span>
                  )
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button className="text-lg py-6" type="submit" disabled={!canSubmit}>
              Sign Up
            </Button>
          </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  )
}