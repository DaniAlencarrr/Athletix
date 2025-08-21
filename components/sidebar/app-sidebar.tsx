"use client";

import * as React from "react";
import {
  Cog,
  Frame,
  Layout,
  LifeBuoy,
  Map,
  MessageCircle,
  PieChart,
  UserCircle2,
  Users,
} from "lucide-react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Início",
      url: "/dashboard",
      icon: Layout,
    },
    {
      title: "Pessoas",
      url: "/dashboard/pessoas",
      icon: Users,
    },
    {
      title: "Chat",
      url: "/dashboard/chat",
      icon: MessageCircle,
    },
    {
      title: "Meu Perfil",
      url: "/dashboard/perfil",
      icon: UserCircle2,
    },
  ],
  navSecondary: [
    {
      title: "Central de Ajuda",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Configurações",
      url: "/dashboard/configuracoes",
      icon: Cog,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src="/logo-athletix.png"
                  alt="Logo Athletix"
                  width={60}
                  height={60}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Atheletix.</span>
                  <span className="truncate text-xs">Plataforma esportiva</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}