import { Link, useLocation } from "react-router"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"

const navItems = [
{ title: "Home", to: "/" },
{ title: "Orders", to: "/orders" },
{ title: "Products", to: "/products" },
]

const NavBar = () => {
  const location = useLocation()

  return (
    <div className="flex justify-center w-full">
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.to}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default NavBar