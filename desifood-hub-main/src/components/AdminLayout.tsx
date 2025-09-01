import { Button } from "@/components/ui/button"; // you can replace with plain <button> if you want
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  BarChart3,
  Percent,
  Menu,
  User,
  Settings,
} from "lucide-react";
import { ReactNode, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    description: "Overview and analytics",
  },
  {
    title: "Products",
    icon: Package,
    href: "/admin/products",
    description: "Manage menu items",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders",
    description: "Order management",
  },
  {
    title: "Categories",
    icon: Tags,
    href: "/admin/categories",
    description: "Product categories",
  },
 
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    description: "Sales and reports",
  },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform`}
      >
        <div className="p-4 flex items-center gap-2 border-b">
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-primary">Spice Palace Admin</h1>
        </div>

        <nav className="p-4 sticky top-0 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 p-2 rounded hover:bg-primary/10 transition 
                ${isActive(item.href) ? "bg-primary/10 font-semibold" : ""}`}
            >
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <span>{item.title}</span>
                <div className="text-xs text-muted-foreground">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
          <br />
         <Link to={'/'}> <button className=" hover:bg-secondary hover:text-white w-full  bg-primary p-2  rounded-lg ">Go to Home</button></Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center h-16 px-4 border-b bg-white md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-xs text-gray-500">Spice Palace Hub</p>
            </div>
          </div>
        
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};
