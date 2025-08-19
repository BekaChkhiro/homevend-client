import React from "react";
import { ProfileSection } from "./ProfileSection";
import { BalanceSection } from "./BalanceSection";
import { SidebarMenu } from "./SidebarMenu";
import { User } from "@/contexts/AuthContext";

interface SidebarProps {
  user: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    <div className="w-64 mr-8 flex flex-col h-full">
      <div className="bg-white rounded-lg border flex flex-col flex-1">
        {/* პროფილის მონაცემები */}
        <ProfileSection user={user} />
        
        {/* ბალანსი */}
        <BalanceSection />
        
        {/* მენიუს ელემენტები */}
        <div className="flex-1">
          <SidebarMenu />
        </div>
      </div>
    </div>
  );
};
