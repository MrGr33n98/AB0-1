'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBar from './SearchBar';

export default function Hero() {
  const stats = [
    { icon: Users, value: '500+', label: 'Empresas Parceiras' },
    { icon: Star, value: '4.8/5', label: 'Avaliação Média' },
    { icon: TrendingUp, value: '10k+', label: 'Projetos Realizados' },
    { icon: Shield, value: '100%', label: 'Empresas Verificadas' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-3xl"></div>

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
              <span className="text-gray-900">Compare e Encontre a</span>{' '}
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Melhor Empresa Solar
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
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
              <SearchBar placeholder="Busque empresas, produtos ou serviços..." />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Painel Solar', 'Inversor', 'Bateria', 'Instalação'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-white rounded-full text-gray-600 border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors"
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
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap className="mr-2 h-5 w-5" />
              Solicitar Orçamento Grátis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300"
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
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl shadow-lg">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
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
        className="mt-16 bg-white/70 backdrop-blur-sm py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Empresas parceiras verificadas:</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {/* Logo placeholders - in real app these would be actual company logos */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}