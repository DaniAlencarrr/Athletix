"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/utils";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleActiveSection = () => {
      const sections = NAV_LINKS.filter((link) =>
        link.href.startsWith("/#")
      ).map((link) => link.href.substring(2));
      const currentPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (currentPosition >= sectionTop) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleActiveSection, { passive: true });
    handleActiveSection();
    return () => {
      window.removeEventListener("scroll", handleActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -80;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    const isScrollLink = href.startsWith("/#");

    if (isScrollLink && pathname === "/") {
      e.preventDefault();
      const sectionId = href.substring(2);
      scrollToSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="bg-black/30 backdrop-blur-md rounded-full shadow-lg px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" passHref>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <Image
                  src="/logo-athletix.png"
                  alt="Logo Athletix"
                  width={85}
                  height={85}
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">Athletix</span>
                  <span className="text-xs font-medium text-green-300">
                    Conectando Talentos
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Navegação Desktop */}
            <motion.nav
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center justify-center space-x-2"
            >
              {NAV_LINKS.map((link) => {
                const isScrollLink = link.href.startsWith("/#");
                const sectionId = isScrollLink ? link.href.substring(2) : "";
                const isActive =
                  (isScrollLink &&
                    pathname === "/" &&
                    activeSection === sectionId) ||
                  (!isScrollLink && pathname === link.href);

                return (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    isActive={isActive}
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </motion.nav>

            {/* Botões Auth Desktop */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden sm:flex items-center space-x-2"
            >
              {session ? (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="bg-white hover:bg-white/90 text-black rounded-full px-5 border-0"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-white hover:bg-white/10 rounded-full px-5"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-white hover:bg-white/90 text-black rounded-full px-5 border-0"
                  >
                    <Link href="/register">Registrar</Link>
                  </Button>
                </>
              )}
            </motion.div>

            {/* Botão Menu Mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed top-24 left-0 right-0 mx-4 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10"
          >
            <div className="p-4">
              <nav className="flex flex-col space-y-2 py-2">
                {NAV_LINKS.map((link, index) => {
                  const isScrollLink = link.href.startsWith("/#");
                  const sectionId = isScrollLink ? link.href.substring(2) : "";
                  const isActive =
                    (isScrollLink &&
                      pathname === "/" &&
                      activeSection === sectionId) ||
                    (!isScrollLink && pathname === link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={`block px-4 py-3 rounded-xl text-white text-lg text-center hover:bg-white/10 transition-all duration-200 ${
                          isActive ? "bg-white/10 font-medium" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Botões de Login e Registrar - Mobile */}
              <div className="sm:hidden pt-4 mt-4 border-t border-white/10 flex flex-col space-y-3">
                {session ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-white hover:bg-white/90 text-black"
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.35 }}
                    >
                      <Button
                        asChild
                        className="w-full bg-white hover:bg-white/90 text-black"
                      >
                        <Link href="/register">Registrar</Link>
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({
  href,
  children,
  isActive,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: (event: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={href}
      className={`group relative px-4 py-2 text-white hover:text-stone-300 transition-colors ${
        isActive ? "text-stone-300" : ""
      }`}
      onClick={onClick}
    >
      {children}
      <span
        className={`absolute bottom-0 left-1/2 h-0.5 bg-blue-200 transition-all duration-300 transform -translate-x-1/2 ${
          isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
        }`}
        style={{ borderRadius: "2px" }}
      ></span>
    </Link>
  );
}
