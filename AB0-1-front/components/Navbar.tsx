'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import CategoryDropdownItem from './CategoryDropdownItem';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/lib/api';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsCategoriesHovered(false);
    }
  }, [isMobileMenuOpen]);
  const { categories, loading, error } = useCategories();

  const navLinks = [
    { href: '/companies', label: 'Empresas' },
    { href: '/products', label: 'Produtos' },
    { href: '/plans', label: 'Planos' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Avalia Solar"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoriesHovered(true)}
            onMouseLeave={() => setIsCategoriesHovered(false)}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-primary focus:outline-none">
              Categorias
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoriesHovered ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isCategoriesHovered && ( !loading && !error && categories.length > 0 ) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute left-0 mt-3 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div className="py-1">
                    {categories.map((category: Category) => (
                      <CategoryDropdownItem
                        key={category.id}
                        category={category}
                        onLinkClick={() => setIsMobileMenuOpen(false)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary text-white">Registrar</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-primary"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-4 py-4 space-y-4">


              <div className="border-b border-gray-200 pb-2">
                <button
                  onClick={() => setIsCategoriesHovered(!isCategoriesHovered)}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-primary focus:outline-none py-2"
                >
                  Categorias
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoriesHovered ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isCategoriesHovered && ( !loading && !error && categories.length > 0 ) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-4 space-y-2">
                        {categories.map((category: Category) => (
                          <CategoryDropdownItem
                            key={category.id}
                            category={category}
                            onLinkClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsCategoriesHovered(false);
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium text-gray-700 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full bg-primary text-white">
                  Registrar
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
