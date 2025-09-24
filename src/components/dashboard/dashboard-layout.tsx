import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { LayoutDashboard, ChevronLeft, Menu, Leaf } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "../theme/theme-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    active: true,
    badge: undefined as string | undefined,
  },
];

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted/20",
        className
      )}
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-1 left-3 z-50 md:hidden cursor-pointer h-9 w-9 p-0 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 rounded-lg shadow-sm"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card/50 backdrop-blur-xl border-r border-border/50 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-base sm:text-lg font-bold transition-opacity duration-200">
                  EcoOffset
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex h-8 w-8 p-0 hover:bg-primary/10 transition-colors cursor-pointer"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  sidebarCollapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.href}
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full h-10 transition-all duration-200 cursor-pointer",
                    sidebarCollapsed
                      ? "justify-center px-2"
                      : "justify-start px-3",
                    item.active &&
                      "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                  aria-label={sidebarCollapsed ? item.title : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      !sidebarCollapsed && "mr-3"
                    )}
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left transition-opacity duration-200">
                        {item.title}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={
                            item.badge === "New" ? "default" : "secondary"
                          }
                          className="ml-auto text-xs transition-opacity duration-200"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && item.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </Button>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/50">
            {sidebarCollapsed ? (
              <div className="flex justify-center">
                <div
                  className="h-3 w-3 rounded-full bg-green-500 animate-pulse"
                  title="System Status: All systems operational"
                  aria-label="System Status: All systems operational"
                ></div>
              </div>
            ) : (
              <div className="rounded-lg bg-primary/5 p-3 text-sm transition-all duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-medium">System Status</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  All systems operational
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Top Header Bar */}
      <header
        className={cn(
          "fixed top-0 right-0 z-40 h-14 sm:h-16 border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out",
          "left-0 md:left-16",
          sidebarCollapsed ? "md:left-16" : "md:left-64"
        )}
      >
        <div className="relative flex h-full items-center">
          {/* Desktop Page Title */}
          <div className="hidden md:block ml-6">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">
              Dashboard
            </h1>
          </div>

          {/* Mobile Logo - Absolutely centered both horizontally and vertically */}
          <div className="absolute inset-0 flex items-center justify-center md:hidden">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight">
                EcoOffset
              </span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center space-x-2 sm:space-x-3 pr-4 sm:pr-6">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-14 sm:pt-16",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function DashboardSection({
  children,
  className,
  title,
  description,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function DashboardGrid({
  children,
  className,
  columns = { default: 1, sm: 2, lg: 3, xl: 4 },
}: DashboardGridProps) {
  const gridClasses = [
    "grid gap-6",
    `grid-cols-${columns.default || 1}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cn(gridClasses, className)}>{children}</div>;
}
