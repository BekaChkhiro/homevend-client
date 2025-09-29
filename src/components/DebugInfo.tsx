import React from 'react';
import { Card } from '@/components/ui/card';

interface DebugInfoProps {
  show?: boolean;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ show = false }) => {
  if (!show) return null;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  return (
    <Card className="p-4 mb-4 bg-yellow-50 border-yellow-200">
      <h4 className="font-medium text-yellow-800 mb-2">Debug Information</h4>
      <div className="text-sm space-y-1">
        <div><strong>API URL:</strong> {apiUrl}</div>
        <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
        <div><strong>Token Present:</strong> {token ? 'Yes' : 'No'}</div>
        <div><strong>User Logged In:</strong> {user ? 'Yes' : 'No'}</div>
        <div><strong>Current URL:</strong> {window.location.href}</div>
        <div><strong>URL Params:</strong> {window.location.search}</div>
      </div>
    </Card>
  );
};

export default DebugInfo;