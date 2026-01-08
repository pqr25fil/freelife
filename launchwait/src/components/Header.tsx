'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { Button } from './ui';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LaunchWait</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors">
              Templates
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Link href="/editor">
              <Button size="sm">Create Page</Button>
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            <Link href="#features" className="block text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#templates" className="block text-gray-600 hover:text-gray-900">
              Templates
            </Link>
            <Link href="#pricing" className="block text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/dashboard" className="block">
              <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
            </Link>
            <Link href="/editor" className="block">
              <Button size="sm" className="w-full">Create Page</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
