
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  MessageCircle,
  School,
  GraduationCap,
  ClipboardList,
  Bell,
  Plus
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from '@/components/Navigation';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingGrades: 0,
    unreadMessages: 0,
  });
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        setStudents(studentsData || []);
        setStats(prev => ({
          ...prev,
          totalStudents: studentsData?.length || 0,
        }));
      }

      // Mock data for classes and other stats
      setStats(prev => ({
        ...prev,
        totalClasses: 6,
        pendingGrades: 12,
        unreadMessages: 5,
      }));

      setClasses([
        { id: 1, name: 'Mathématiques 3ème', students: 25, nextClass: '2024-01-15 09:00' },
        { id: 2, name: 'Physique 2nde', students: 28, nextClass: '2024-01-15 10:30' },
        { id: 3, name: 'Mathématiques 1ère', students: 22, nextClass: '2024-01-15 14:00' },
      ]);

    } catch (error) {
      console.error('Error fetching teacher data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données enseignant",
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
          <h1 className="text-3xl font-bold text-slate-900">Espace Enseignant</h1>
          <p className="text-slate-600">Gérez vos classes et suivez vos étudiants</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Mes Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalClasses}</div>
              <p className="text-xs text-blue-600 mt-1">Classes assignées</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Étudiants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.totalStudents}</div>
              <p className="text-xs text-green-600 mt-1">Total dans mes classes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Évaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.pendingGrades}</div>
              <p className="text-xs text-orange-600 mt-1">À corriger</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.unreadMessages}</div>
              <p className="text-xs text-purple-600 mt-1">Non lus</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classes">Mes Classes</TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
            <TabsTrigger value="grades">Notes</TabsTrigger>
            <TabsTrigger value="schedule">Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-xl text-slate-800">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                      Mes Classes
                    </CardTitle>
                    <CardDescription>
                      Gérez vos classes et cours
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau cours
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{classItem.name}</p>
                          <p className="text-sm text-slate-600">{classItem.students} étudiants</p>
                          <p className="text-xs text-slate-500">Prochain cours: {new Date(classItem.nextClass).toLocaleString('fr-FR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Actif</Badge>
                        <Button variant="outline" size="sm">
                          Voir détails
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
                  Mes Étudiants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.first_name?.[0]}{student.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.first_name} {student.last_name}</p>
                          <p className="text-sm text-slate-600">Classe: {student.class_level}</p>
                          <p className="text-xs text-slate-500">N° {student.student_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Voir profil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <ClipboardList className="mr-2 h-5 w-5 text-purple-600" />
                  Gestion des Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Interface de gestion des notes à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <Calendar className="mr-2 h-5 w-5 text-orange-600" />
                  Mon Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Interface de planning à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
