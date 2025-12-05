"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white">
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2ZM21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2ZM12 2a2 2 0 0 1 2 2v14a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2Z"/>
              </svg>
            </div>
            <span className="text-xl font-bold">Sistema Judicial Bolivia</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {/* Funcionalidades Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-foreground hover:text-primary">
              Funcionalidades <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/#demandas">Demandas Digitales</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#citaciones">Citaciones Inteligentes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#audiencias">Audiencias Virtuales</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#resoluciones">Resoluciones y Sentencias</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#expediente">Expediente Digital</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Roles Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-foreground hover:text-primary">
              Usuarios <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Por Rol
              </div>
              <DropdownMenuItem asChild>
                <Link href="/#para-abogados">Para Abogados</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#para-jueces">Para Jueces</Link>
              </DropdownMenuItem>
              <div className="my-1 border-t" />
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Por Materia
              </div>
              <DropdownMenuItem asChild>
                <Link href="/#civil">Materia Civil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#familiar">Materia Familiar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#comercial">Materia Comercial</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Recursos Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-foreground hover:text-primary">
              Recursos <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/#documentacion">Documentación</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#codigo-procesal">Código Procesal Civil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#preguntas-frecuentes">Preguntas Frecuentes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/#soporte">Soporte Técnico</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/#beneficios"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary"
          >
            Beneficios
          </Link>
        </div>

        {/* Right side buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Panel</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Iniciar Sesión</Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <Link href="/sign-up">Registrarse</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-4 pb-4 pt-2">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Product
              </div>
              <Link
                href="/product/ai-calls"
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Calls
              </Link>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Solutions
              </div>
              <Link
                href="/solutions/sales"
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sales
              </Link>
              <Link
                href="/solutions/marketing"
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketing
              </Link>
            </div>

            <Link
              href="/pricing"
              className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            <div className="mt-4 space-y-2">
              <div className="px-3 py-2">
                <ThemeToggle />
              </div>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
