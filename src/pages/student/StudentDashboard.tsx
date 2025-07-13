
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Calendar, 
  MessageCircle,
  School,
  GraduationCap,
  ClipboardList,
  Bell,
  Trophy,
  Clock,
  Users
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from '@/components/Navigation';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    averageGrade: 0,
    pendingAssignments: 0,
    unreadMessages: 0,
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for student interface
      setStats({
        totalCourses: 8,
        averageGrade: 15.2,
        pendingAssignments: 3,
        unreadMessages: 2,
      });

      setCourses([
        { id: 1, name: 'Mathématiques', teacher: 'M. Dupont', nextClass: '2024-01-15 09:00', room: 'A101' },
        { id: 2, name: 'Physique-Chimie', teacher: 'Mme Martin', nextClass: '2024-01-15 10:30', room: 'B205' },
        { id: 3, name: 'Français', teacher: 'M. Bernard', nextClass: '2024-01-15 14:00', room: 'C302' },
        { id: 4, name: 'Histoire-Géographie', teacher: 'Mme Rousseau', nextClass: '2024-01-16 08:30', room: 'A203' },
      ]);

      setGrades([
        { id: 1, subject: 'Mathématiques', grade: 16, coefficient: 3, date: '2024-01-10', type: 'Devoir surveillé' },
        { id: 2, subject: 'Physique', grade: 14, coefficient: 2, date: '2024-01-08', type: 'TP' },
        { id: 3, subject: 'Français', grade: 15, coefficient: 4, date: '2024-01-05', type: 'Dissertation' },
      ]);

      setAssignments([
        { id: 1, subject: 'Mathématiques', title: 'Exercices chapitre 5', dueDate: '2024-01-20', status: 'pending' },
        { id: 2, subject: 'Physique', title: 'Rapport TP Optique', dueDate: '2024-01-18', status: 'pending' },
        { id: 3, subject: 'Français', title: 'Analyse de texte', dueDate: '2024-01-22', status: 'pending' },
      ]);

    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données étudiant",
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
          <h1 className="text-3xl font-bold text-slate-900">Espace Étudiant</h1>
          <p className="text-slate-600">Suivez votre progression scolaire</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Mes Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalCourses}</div>
              <p className="text-xs text-blue-600 mt-1">Matières suivies</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.averageGrade.toFixed(1)}</div>
              <p className="text-xs text-green-600 mt-1">Moyenne générale</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Devoirs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.pendingAssignments}</div>
              <p className="text-xs text-orange-600 mt-1">À rendre</p>
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

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Mes Cours</TabsTrigger>
            <TabsTrigger value="grades">Notes</TabsTrigger>
            <TabsTrigger value="assignments">Devoirs</TabsTrigger>
            <TabsTrigger value="schedule">Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                  Mes Cours
                </CardTitle>
                <CardDescription>
                  Vos matières et prochains cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-slate-600">Professeur: {course.teacher}</p>
                          <p className="text-xs text-slate-500">
                            Prochain cours: {new Date(course.nextClass).toLocaleString('fr-FR')} - Salle {course.room}
                          </p>
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

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <Trophy className="mr-2 h-5 w-5 text-green-600" />
                  Mes Notes
                </CardTitle>
                <CardDescription>
                  Suivi de vos résultats scolaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${grade.grade >= 16 ? 'bg-green-100' : grade.grade >= 12 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                          <Trophy className={`h-5 w-5 ${grade.grade >= 16 ? 'text-green-600' : grade.grade >= 12 ? 'text-yellow-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <p className="font-medium">{grade.subject} - {grade.type}</p>
                          <p className="text-sm text-slate-600">
                            Note: {grade.grade}/20 (Coef. {grade.coefficient})
                          </p>
                          <p className="text-xs text-slate-500">
                            Date: {new Date(grade.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${grade.grade >= 16 ? 'text-green-600' : grade.grade >= 12 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {grade.grade}
                        </div>
                        <div className="text-xs text-slate-500">/20</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <ClipboardList className="mr-2 h-5 w-5 text-orange-600" />
                  Mes Devoirs
                </CardTitle>
                <CardDescription>
                  Travaux à rendre et échéances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <ClipboardList className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-slate-600">Matière: {assignment.subject}</p>
                          <p className="text-xs text-slate-500">
                            À rendre le: {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={assignment.status === 'pending' ? 'destructive' : 'default'}>
                          {assignment.status === 'pending' ? 'À faire' : 'Terminé'}
                        </Badge>
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

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                  Mon Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Interface de planning étudiant à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
