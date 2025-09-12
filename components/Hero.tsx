'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Mantido, caso o SearchBar interno use Input
import SearchBar from './SearchBar'; // MANTIDO: O seu componente SearchBar

export default function Hero() {
  const stats = [
    { icon: Users, value: '500+', label: 'Empresas Parceiras' },
    { icon: Star, value: '4.8/5', label: 'Avaliação Média' },
    { icon: TrendingUp, value: '10k+', label: 'Projetos Realizados' },
    { icon: Shield, value: '100%', label: 'Empresas Verificadas' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary-light via-background to-primary-lightest py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Background Decorations */}
      {/* Ajuste dos gradientes de fundo para a nova paleta */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary-light to-accent rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-accent to-primary-light rounded-full opacity-20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-foreground">Compare e Encontre a</span>{' '} {/* Usando text-foreground */}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> {/* Gradiente com primary e accent */}
                Melhor Empresa Solar
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed"> {/* Usando text-muted-foreground */}
              Conecte-se com as melhores empresas de energia solar do Brasil. 
              Compare preços, avaliações e encontre a solução perfeita para sua casa ou empresa.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="relative">
              {/* MANTIDO: O seu componente SearchBar */}
              <SearchBar placeholder="Busque empresas, produtos ou serviços..." />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Painel Solar', 'Inversor', 'Bateria', 'Instalação'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-card rounded-full text-muted-foreground border border-border hover:border-accent-dark cursor-pointer transition-colors" /* Cores ajustadas */
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" /* Gradiente com primary e accent, texto primary-foreground */
            >
              <Zap className="mr-2 h-5 w-5" />
              Solicitar Orçamento Grátis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary-light hover:text-primary-foreground px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300" /* Border e text-primary, hover para primary-light */
            >
              Ver Empresas Verificadas
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg"> {/* Gradiente com primary e accent */}
                    <stat.icon className="h-6 w-6 text-primary-foreground" /> {/* Ícones com text-primary-foreground */}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div> {/* Usando text-foreground */}
                <div className="text-sm text-muted-foreground">{stat.label}</div> {/* Usando text-muted-foreground */}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Trust Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 bg-card/70 backdrop-blur-sm py-6" /* Usando bg-card/70 */
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Empresas parceiras verificadas:</p> {/* Usando text-muted-foreground */}
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {/* Logo placeholders - in real app these would be actual company logos */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-12 bg-secondary rounded-lg flex items-center justify-center"> {/* Usando bg-secondary */}
                  <span className="text-xs text-muted-foreground">Logo {i}</span> {/* Usando text-muted-foreground */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}