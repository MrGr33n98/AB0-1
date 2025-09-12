'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Bell,
  MessageSquare,
  Briefcase, // Para "Plano Profissional"
  LayoutGrid, // Para "Meus Anúncios" (usando como Dashboard/Grid de anúncios)
  User,
  Menu, // Ícone de menu para mobile
  X // Ícone de fechar para mobile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo.png" alt="Compare Solar Logo" width={120} height={32} className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation Items (Central) */}
        <div className="hidden lg:flex items-center space-x-6 text-foreground">
          {/* Itens com ícones */}
          <Link href="/plano-profissional" className="flex items-center hover:text-primary transition-colors">
            <Briefcase className="h-4 w-4 mr-1" /> Plano Profissional
          </Link>
          <Link href="/meus-anuncios" className="flex items-center hover:text-primary transition-colors">
            <LayoutGrid className="h-4 w-4 mr-1" /> Meus Anúncios
          </Link>
          <Link href="/chat" className="flex items-center hover:text-primary transition-colors">
            <MessageSquare className="h-4 w-4 mr-1" /> Chat
          </Link>
          <Link href="/notifications" className="flex items-center hover:text-primary transition-colors">
            <Bell className="h-4 w-4 mr-1" /> Notificações
          </Link>
          {/* Itens sem ícones, como links de texto simples (como você tinha antes) */}
          <Link href="/companies" className="hover:text-primary transition-colors"> {/* Endpoint alterado para /companies */}
            Empresas
          </Link>
          <Link href="/categories" className="hover:text-primary transition-colors"> {/* Endpoint alterado para /categories */}
            Categorias
          </Link>
        </div>

        {/* Right Side Icons/Buttons */}
        <div className="flex items-center space-x-4">
          {/* Ícone de Busca */}
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </Button>

          {/* Barra de Busca Expansível (se isSearchOpen for true) */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isSearchOpen ? '200px' : 0, opacity: isSearchOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {isSearchOpen && (
              <Input
                type="text"
                placeholder="Buscar..."
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          </motion.div>
          
          {/* Botão de Perfil/Login para desktop */}
          <Link href="/profile" passHref>
            <Button variant="ghost" className="hidden md:inline-flex text-foreground hover:text-primary">
              <User className="h-5 w-5 mr-2" />
              <span>Perfil</span>
            </Button>
          </Link>

          {/* Botão para o menu mobile (Hamburger) */}
          <Button variant="ghost" size="icon" className="lg:hidden text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu (condicional) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden px-4 pt-2 pb-4 space-y-2 bg-background border-t border-border"
          >
            {/* Itens com ícones para mobile */}
            <Link href="/plano-profissional" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted" onClick={handleMenuItemClick}>
              <Briefcase className="h-5 w-5 mr-2" /> Plano Profissional
            </Link>
            <Link href="/meus-anuncios" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted" onClick={handleMenuItemClick}>
              <LayoutGrid className="h-5 w-5 mr-2" /> Meus Anúncios
            </Link>
            <Link href="/chat" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted" onClick={handleMenuItemClick}>
              <MessageSquare className="h-5 w-5 mr-2" /> Chat
            </Link>
            <Link href="/notifications" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted" onClick={handleMenuItemClick}>
              <Bell className="h-5 w-5 mr-2" /> Notificações
            </Link>
            {/* Itens sem ícones para mobile */}
            <Link href="/companies" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted" onClick={handleMenuItemClick}>
              Empresas
            </Link>
            <Link href="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted" onClick={handleMenuItemClick}>
              Categorias
            </Link>
            <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted" onClick={handleMenuItemClick}>
              <User className="h-5 w-5 mr-2" /> Perfil
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}