import { useState, JSX, useEffect, useRef } from "react";
import React from "react";
import gsap from "gsap";
import { useNavigation } from "@/app/(erp)/context/NavigationContext";
import { navItems } from "./subcomponents/NavItems";
import { SidebarItem } from "./subcomponents/SidebarItem";
import { Menu, X } from "lucide-react";
import { CustomCard } from "@/components/ui/CustomCard";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  const { setCurrentPage } = useNavigation();
  const [activePage, setActivePage] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: string, icon: JSX.Element) => {
    setCurrentPage(page, icon);
    setActivePage(page);
  };

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: isExpanded ? "16rem" : "3.5rem",
        duration: 0.2,
        ease: "bounce.Out",
      });
    }
  }, [isExpanded]);

  // Animate only the text (the name) when expanding with easing
  useEffect(() => {
    if (isExpanded && sidebarRef.current) {
      const q = gsap.utils.selector(sidebarRef.current);
      gsap.utils.toArray(q("span.text-sm")).forEach((el, index) => {
        gsap.timeline({ delay: index * 0.075 })
          .fromTo(
            el as gsap.TweenTarget,
            { x: -20, opacity: 0 },
            { x: 20, y: -2, rotate: 3, opacity: 1, duration: 0.25, ease: "bounce.Out" }
          )
          .to(el as gsap.TweenTarget, { x: 0, y: 0, rotate: 0, duration: 0.2, ease: "bounce.inOut" });
      });
    }
  }, [isExpanded]);

  return (
    <>
      <TooltipProvider>
        {/* 🔹 Sidebar for Medium to Large Screens */}
        <CustomCard
          ref={sidebarRef}
          variant={"transparent"}
          className={`hidden md:flex flex-col self-start pb-4 pt-4 rounded-lg transition-all ease-in-out
          hover:shadow-md hover:cursor-pointer hover:backdrop-filter hover:backdrop-blur-3xl hover:bg-[var(--secondary-light-01)]`}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <ul className="space-y-4">
            {navItems.map(({ name, href, icon }) => (
              <div key={name} className="relative">
                {isExpanded ? (
                  // Render SidebarItem directly when expanded (no Tooltip)
                  <SidebarItem
                    name={name}
                    href={href}
                    Icon={icon}
                    isActive={activePage === name}
                    isExpanded={isExpanded}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageChange(
                        name,
                        React.createElement(icon, {
                          className: "w-5 h-5 text-secondary-lighter",
                        })
                      );
                    }}
                  />
                ) : (
                  // Wrap SidebarItem in Tooltip when collapsed
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center items-center w-full">
                        <SidebarItem
                          name={name}
                          href={href}
                          Icon={icon}
                          isActive={activePage === name}
                          isExpanded={isExpanded}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePageChange(
                              name,
                              React.createElement(icon, {
                                className: "w-5 h-5 text-secondary-lighter",
                              })
                            );
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="ml-2 bg-accent text-secondary-lighter"
                    >
                      {name}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </ul>
        </CustomCard>

        {/* 🔹 Mobile Sidebar Button */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden fixed left-4 z-50 bg-[var(--primary-5)] p-2 rounded-full shadow-md"
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          {isMobileOpen ? (
            <X className="w-6 h-6 text-secondary-lighter" />
          ) : (
            <Menu className="w-6 h-6 text-secondary-lighter" />
          )}
        </Button>

        {/* 🔹 Mobile Sidebar (Dropdown) */}
        <div
          className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity 
          ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <CustomCard
            className={`fixed top-32 left-0 h-full w-64 bg-[var(--bg-primary-5)] shadow-lg pt-4 px-6 transform transition-transform duration-300 
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-4">
              {navItems.map(({ name, href, icon }) => (
                <SidebarItem
                  key={name}
                  name={name}
                  href={href}
                  Icon={icon}
                  isActive={activePage === name}
                  isExpanded={true}
                  onClick={() => {
                    handlePageChange(
                      name,
                      React.createElement(icon, {
                        className: "w-5 h-5 text-secondary-lighter",
                      })
                    );
                    setIsMobileOpen(false);
                  }}
                />
              ))}
            </ul>
          </CustomCard>
        </div>
      </TooltipProvider>
    </>
  );
}
