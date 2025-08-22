import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { ProfileSection } from "./ProfileSection";
import { BalanceSection, BalanceSectionRef } from "./BalanceSection";
import { SidebarMenu } from "./SidebarMenu";
import { User } from "@/contexts/AuthContext";

interface SidebarProps {
  user: User;
  isMobile?: boolean;
  onNavigate?: () => void;
}


export interface SidebarRef {
  refreshBalance: () => void;
}

export const Sidebar = forwardRef<SidebarRef, SidebarProps>(({ user, isMobile = false, onNavigate }, ref) => {
  const balanceSectionRef = useRef<BalanceSectionRef>(null);

  useImperativeHandle(ref, () => ({
    refreshBalance: () => {
      balanceSectionRef.current?.refreshBalance();
    }
  }));

  return (
    <div className={isMobile ? "w-full flex flex-col h-full" : "w-64 flex flex-col h-full"}>
      <div className={`bg-white ${isMobile ? '' : 'rounded-lg border'} flex flex-col flex-1`}>
        {/* პროფილის მონაცემები */}
        <ProfileSection user={user} />
        
        {/* ბალანსი */}
        <BalanceSection ref={balanceSectionRef} />
        
        {/* მენიუს ელემენტები */}
        <div className="flex-1">
          <SidebarMenu onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
});
