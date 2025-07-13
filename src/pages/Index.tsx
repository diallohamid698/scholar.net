
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  FileText, 
  GraduationCap,
  Bell,
  Settings,
  UserCheck,
  Clock,
  Award,
  School,
  LogOut,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import Navigation from '@/components/Navigation';
import RoleBasedRedirect from '@/components/RoleBasedRedirect';
import { useUserRole } from '@/hooks/useUserRole';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the role hook
  const { userProfile, isLoading: roleLoading } = useUserRole(user);

  useEffect(() => {
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session) {
          fetchUserData(session.user.id);
        } else {
          setIsLoading(false);
        }
      }
    );

    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

      // Only fetch parent-specific data if user is a parent
      if (profileData?.role === 'parent' || !profileData?.role) {
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
          .limit(5);

        if (notificationsError) {
          console.error('Error fetching notifications:', notificationsError);
        } else {
          setNotifications(notificationsData || []);
        }
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show role-based redirect if user is authenticated
  if (user && userProfile && !roleLoading) {
    return <RoleBasedRedirect userRole={userProfile.role} isLoading={roleLoading} />;
  }

  const getOverdueFees = () => {
    const today = new Date();
    return studentFees.filter(fee => 
      fee.status === 'pending' && new Date(fee.due_date) < today
    );
  };

  const getPendingFees = () => {
    return studentFees.filter(fee => fee.status === 'pending');
  };

  const getPaidFees = () => {
    return studentFees.filter(fee => fee.status === 'paid');
  };

  const getTotalAmount = (fees: any[]) => {
    return fees.reduce((total, fee) => total + parseFloat(fee.amount), 0);
  };

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <School className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher la page d'accueil publique
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl">
                <School className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Bienvenue sur EcoleNet
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              La plateforme de gestion scolaire complète
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <GraduationCap className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>Suivi des enfants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Gérez les informations de vos enfants scolarisés
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CreditCard className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <CardTitle>Paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Suivez et payez les frais scolaires en ligne
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <CardTitle>Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Communiquez directement avec l'école
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                <CardTitle>Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Consultez le calendrier scolaire et les événements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Role-specific features */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
              Espaces dédiés par rôle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-blue-200">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <CardTitle className="text-blue-800">Espace Parent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Suivez la scolarité de vos enfants, gérez les paiements et communiquez avec l'école
                  </p>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    Suivi • Paiements • Communication
                  </Badge>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-green-200">
                <CardHeader>
                  <BookOpen className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <CardTitle className="text-green-800">Espace Enseignant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Gérez vos classes, notez vos élèves et communiquez avec les parents
                  </p>
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    Classes • Notes • Planning
                  </Badge>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-purple-200">
                <CardHeader>
                  <GraduationCap className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                  <CardTitle className="text-purple-800">Espace Étudiant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Consultez vos notes, votre emploi du temps et vos devoirs à rendre
                  </p>
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    Notes • Planning • Devoirs
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If user is authenticated but we're still here, show parent dashboard content
  const overdueFees = getOverdueFees();
  const pendingFees = getPendingFees();
  const paidFees = getPaidFees();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation user={user} profile={profile} notifications={notifications} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-red-700">Frais en retard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{overdueFees.length}</div>
              <p className="text-xs text-red-600 mt-1">{getTotalAmount(overdueFees).toFixed(2)} €</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">À payer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{pendingFees.length}</div>
              <p className="text-xs text-orange-600 mt-1">{getTotalAmount(pendingFees).toFixed(2)} €</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Payés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{paidFees.length}</div>
              <p className="text-xs text-green-600 mt-1">{getTotalAmount(paidFees).toFixed(2)} €</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Students and Fees */}
          <div className="lg:col-span-2 space-y-6">
            {/* Students */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-xl text-slate-800">
                      <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                      Mes Enfants
                    </CardTitle>
                    <CardDescription>
                      Liste de vos enfants inscrits
                    </CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link to="/dashboard">
                      <Plus className="h-4 w-4 mr-2" />
                      Gérer
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {students.length > 0 ? (
                  students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.first_name[0]}{student.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.first_name} {student.last_name}</p>
                          <p className="text-sm text-slate-600">Classe: {student.class_level}</p>
                          <p className="text-xs text-slate-500">N° {student.student_number}</p>
                        </div>
                      </div>
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600">Aucun enfant inscrit</p>
                    <p className="text-sm text-slate-500">Ajoutez vos enfants dans le tableau de bord</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fees */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                  Frais Scolaires
                </CardTitle>
                <CardDescription>
                  Suivi des paiements scolaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentFees.length > 0 ? (
                  studentFees.slice(0, 5).map((fee) => (
                    <div key={fee.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {fee.fee_types?.name} - {fee.students?.first_name} {fee.students?.last_name}
                          </h3>
                          <p className="text-sm text-slate-600">{fee.amount} € - Échéance: {new Date(fee.due_date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {fee.status === 'paid' && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {fee.status === 'pending' && new Date(fee.due_date) < new Date() && <AlertTriangle className="h-5 w-5 text-red-600" />}
                          <Badge 
                            variant={fee.status === 'paid' ? 'default' : 
                                   fee.status === 'pending' && new Date(fee.due_date) < new Date() ? 'destructive' : 'secondary'}
                          >
                            {fee.status === 'paid' ? 'Payé' : 
                             fee.status === 'pending' && new Date(fee.due_date) < new Date() ? 'En retard' : 'À payer'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600">Aucun frais scolaire</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications and Quick Actions */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-slate-800">
                  <Bell className="mr-2 h-4 w-4 text-orange-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-medium text-sm text-slate-900">{notification.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Bell className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">Aucune notification</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/dashboard">
                    <Users className="mr-2 h-4 w-4" />
                    Gérer mes enfants
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/dashboard">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Historique des paiements
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/schedule">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendrier scolaire
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/messages">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contacter l'école
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                  <Link to="/dashboard">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
