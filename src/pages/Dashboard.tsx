import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  School, 
  GraduationCap, 
  CreditCard, 
  Settings,
  User
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import StudentManager from '@/components/StudentManager';
import PaymentManager from '@/components/PaymentManager';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate('/login');
        } else {
          fetchUserData(session.user.id);
        }
      }
    );

    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate('/login');
      } else {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Récupérer le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Récupérer les étudiants
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', userId);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        setStudents(studentsData || []);
        
        // Récupérer les frais pour chaque étudiant
        if (studentsData && studentsData.length > 0) {
          const studentIds = studentsData.map(s => s.id);
          const { data: feesData, error: feesError } = await supabase
            .from('student_fees')
            .select(`
              *,
              fee_types(*),
              students(first_name, last_name)
            `)
            .in('student_id', studentIds);

          if (feesError) {
            console.error('Error fetching fees:', feesError);
          } else {
            setStudentFees(feesData || []);
          }
        }
      }

      // Récupérer les notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('payment_notifications')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError);
      } else {
        setNotifications(notificationsData || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    if (user) {
      fetchUserData(user.id);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <School className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const overdueFees = studentFees.filter(fee => 
    fee.status === 'pending' && new Date(fee.due_date) < new Date()
  );
  const pendingFees = studentFees.filter(fee => fee.status === 'pending');
  const paidFees = studentFees.filter(fee => fee.status === 'paid');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation user={user} profile={profile} notifications={notifications} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="students">Mes enfants</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Mes Enfants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{students.length}</div>
                  <p className="text-xs text-blue-600 mt-1">Élèves inscrits</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">En retard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">{overdueFees.length}</div>
                  <p className="text-xs text-red-600 mt-1">Paiements urgents</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">À payer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">{pendingFees.length}</div>
                  <p className="text-xs text-orange-600 mt-1">Frais en attente</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Payés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{paidFees.length}</div>
                  <p className="text-xs text-green-600 mt-1">Frais réglés</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.slice(0, 5).map((notification) => (
                        <div key={notification.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-center py-4">Aucune notification</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paiements urgents</CardTitle>
                </CardHeader>
                <CardContent>
                  {overdueFees.length > 0 ? (
                    <div className="space-y-3">
                      {overdueFees.slice(0, 3).map((fee) => (
                        <div key={fee.id} className="p-3 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                          <h4 className="font-medium text-sm">
                            {fee.fee_types?.name} - {fee.students?.first_name} {fee.students?.last_name}
                          </h4>
                          <p className="text-xs text-slate-600">
                            {fee.amount} € - Échéance dépassée le {new Date(fee.due_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-center py-4">Aucun paiement en retard</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Gestion des enfants
                </CardTitle>
                <CardDescription>
                  Gérez les informations de vos enfants scolarisés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudentManager 
                  students={students} 
                  onStudentAdded={refreshData}
                  onStudentUpdated={refreshData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManager 
              studentFees={studentFees}
              onPaymentMade={refreshData}
            />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profil utilisateur
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Prénom</label>
                    <p className="text-slate-600">{profile?.first_name || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nom</label>
                    <p className="text-slate-600">{profile?.last_name || 'Non renseigné'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-slate-600">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <p className="text-slate-600">{profile?.phone || 'Non renseigné'}</p>
                </div>
                <Button className="mt-4">
                  <Settings className="mr-2 h-4 w-4" />
                  Modifier le profil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
