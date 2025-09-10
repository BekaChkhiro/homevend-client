import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/contexts/AuthContext';
import { agencyApi } from '@/lib/api';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  Crown,
  Building2,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLanguageUrl } from '@/components/LanguageRoute';

interface AgencyUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

const AgencyUsers = () => {
  const { t, i18n } = useTranslation('userDashboard');
  const [users, setUsers] = useState<AgencyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await agencyApi.getMyAgencyUsers();
      setUsers(users);
    } catch (error: any) {
      console.error('Error fetching agency users:', error);
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('agencyUsers.messages.loadError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast({
        title: t('common.error'),
        description: t('agencyUsers.messages.emailRequired'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsAddingUser(true);
      const result = await agencyApi.addUserToMyAgency(inviteEmail);
      
      toast({
        title: t('common.success'),
        description: result.message || t('agencyUsers.messages.addSuccess'),
      });
      
      setInviteEmail('');
      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      console.error('Error adding user to agency:', error);
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('agencyUsers.messages.addError'),
        variant: 'destructive',
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: number, userName: string) => {
    if (!confirm(t('agencyUsers.actions.confirmRemove', { userName }))) {
      return;
    }

    try {
      setRemovingUserId(userId);
      const result = await agencyApi.removeUserFromMyAgency(userId);
      
      toast({
        title: t('common.success'),
        description: result.message || t('agencyUsers.messages.removeSuccess'),
      });
      
      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      console.error('Error removing user from agency:', error);
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('agencyUsers.messages.removeError'),
        variant: 'destructive',
      });
    } finally {
      setRemovingUserId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'agency':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            <Crown className="h-3 w-3 mr-1" />
            {t('agencyUsers.roles.agency')}
          </Badge>
        );
      case 'agent':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            {t('agencyUsers.roles.agent')}
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
            <Shield className="h-3 w-3 mr-1" />
            {t('agencyUsers.roles.admin')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t('agencyUsers.roles.user')}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">{t('agencyUsers.messages.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('agencyUsers.title')}</h1>
          <p className="text-gray-600">{t('agencyUsers.subtitle')}</p>
        </div>
      </div>

      {/* Add User Section */}
      <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <UserPlus className="h-5 w-5" />
            {t('agencyUsers.addAgent.title')}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {t('agencyUsers.addAgent.description')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder={t('agencyUsers.addAgent.emailPlaceholder')}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={isAddingUser}
                className="bg-white"
              />
            </div>
            <Button 
              onClick={handleInviteUser}
              disabled={isAddingUser || !inviteEmail.trim()}
              className="flex items-center gap-2"
            >
              {isAddingUser ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('agencyUsers.addAgent.adding')}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  {t('agencyUsers.addAgent.addButton')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {t('agencyUsers.currentAgents.title')}
            </CardTitle>
            {users.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                {t('agencyUsers.currentAgents.total')}: {users.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('agencyUsers.currentAgents.noAgents')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('agencyUsers.currentAgents.noAgentsDesc')}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4" />
                {t('agencyUsers.currentAgents.noAgentsTip')}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user, index) => (
                <div key={user.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {user.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{user.fullName}</h4>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(user.createdAt).toLocaleDateString('ka-GE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={getLanguageUrl(`user/${user.id}`, i18n.language)}>
                        <Button variant="outline" size="sm" className="text-primary hover:text-primary">
                          <Eye className="h-4 w-4 mr-1" />
                          {t('agencyUsers.actions.view')}
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveUser(user.id, user.fullName)}
                        disabled={removingUserId === user.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        {removingUserId === user.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            {t('agencyUsers.actions.removing')}
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            {t('agencyUsers.actions.remove')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {index < users.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const UsersPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <AgencyUsers />
        </div>
    )
}

export default UsersPage;
