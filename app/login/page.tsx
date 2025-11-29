'use client'

import Layout from '@/components/layout'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { loginFormSchema } from '@/lib/validation-schemas'

const formSchema = loginFormSchema

export default function LoginPreview() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values?.email || !values?.password) return
    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email.trim(), password: values.password }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // store token (consider HttpOnly cookie in production)
        toast.success('Logged in')
        router.push('/dashboard')
        return
      }

      // If server indicates invalid credentials, show field-level error
      if (res.status === 400) {
        const message = data?.error || data?.message || 'Invalid login credentials'
        // show the message under the password input
        form.setError('password', { type: 'server', message })
        // clear any email-specific errors
        form.clearErrors('email')
        toast.error(message)
        return
      }

      toast.error(data?.error || data?.message || 'Login failed')
    } catch (err) {
      console.error('Login error', err)
      toast.error('Network error during login')
      setIsLoading(false)
    }
  }

  return (

    <Layout>
      <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4 my-20">
        <Card className="mx-auto w-full sm:w-[500px]">
          <CardHeader>
            <CardTitle className="text-3xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel className="text-lg" htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="johndoe@mail.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-lg" htmlFor="password">Password</FormLabel>
                          
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <Link
                            href="#"
                            className="ml-auto inline-block text-md underline mb-6"
                          >
                            Forgot your password?
                          </Link>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button size={"lg"} type="submit" className="w-full cursor-pointer text-lg flex items-center justify-center gap-2" disabled={isLoading}>
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    )}
                    <span>{isLoading ? 'Signing in…' : 'Login'}</span>
                  </Button>
                  <Button size={"lg"} variant="outline" className="w-full cursor-pointer text-lg">
                    Login with Google
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-md">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
