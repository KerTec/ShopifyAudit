import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Home, DollarSign, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SA</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopifyAudit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Audit</span>
              </Button>
            </Link>
            
            <Link href="/pricing">
              <Button 
                variant={location === "/pricing" ? "default" : "ghost"} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Tarifs</span>
              </Button>
            </Link>

            <Link href="/contact">
              <Button 
                variant={location === "/contact" ? "default" : "ghost"} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contact</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isMenuOpen ? (
                <div className="w-4 h-4 relative">
                  <div className="absolute inset-0 w-4 h-0.5 bg-current transform rotate-45 top-2"></div>
                  <div className="absolute inset-0 w-4 h-0.5 bg-current transform -rotate-45 top-2"></div>
                </div>
              ) : (
                <div className="w-4 h-4 relative">
                  <div className="absolute top-0 w-4 h-0.5 bg-current"></div>
                  <div className="absolute top-1.5 w-4 h-0.5 bg-current"></div>
                  <div className="absolute top-3 w-4 h-0.5 bg-current"></div>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex flex-col space-y-2">
              <Link href="/" onClick={closeMenu}>
                <Button 
                  variant={location === "/" ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Audit SEO</span>
                </Button>
              </Link>
              
              <Link href="/pricing" onClick={closeMenu}>
                <Button 
                  variant={location === "/pricing" ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Tarifs</span>
                </Button>
              </Link>

              <Link href="/contact" onClick={closeMenu}>
                <Button 
                  variant={location === "/contact" ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Contact</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}