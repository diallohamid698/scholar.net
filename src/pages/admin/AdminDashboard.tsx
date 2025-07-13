
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Settings,
  School,
  UserPlus,
  BookOpen,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from '@/components/Navigation';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        setUsers(usersData || []);
      }

      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // Fetch payments data
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount, status');

      const pendingPayments = paymentsData?.filter(p => p.status === 'pending').length || 0;
      const totalRevenue = paymentsData?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

      setStats({
        totalStudents: studentsCount || 0,
        totalTeachers: usersData?.filter(u => u.role === 'teacher').length || 0,
        totalParents: usersData?.filter(u => u.role === 'parent').length || 0,
        pendingPayments,
        totalRevenue,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données administrateur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <School className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Tableau de bord Admin</h1>
          <p className="text-slate-600">Gestion complète de l'établissement scolaire</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Étudiants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalStudents}</div>
              <p className="text-xs text-blue-600 mt-1">Inscrits actifs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Enseignants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.totalTeachers}</div>
              <p className="text-xs text-green-600 mt-1">Personnel actif</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Parents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.totalParents}</div>
              <p className="text-xs text-purple-600 mt-1">Comptes parents</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.pendingPayments}</div>
              <p className="text-xs text-orange-600 mt-1">En attente</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{stats.totalRevenue.toFixed(2)} €</div>
              <p className="text-xs text-emerald-600 mt-1">Total encaissé</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-xl text-slate-800">
                      <Users className="mr-2 h-5 w-5 text-blue-600" />
                      Gestion des utilisateurs
                    </CardTitle>
                    <CardDescription>
                      Gérer tous les comptes utilisateurs
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                          {user.role || 'parent'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <GraduationCap className="mr-2 h-5 w-5 text-green-600" />
                  Gestion des étudiants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Interface de gestion des étudiants à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
                  Gestion financière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Interface de gestion financière à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <Settings className="mr-2 h-5 w-5 text-slate-600" />
                  Paramètres système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Interface de paramètres système à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
