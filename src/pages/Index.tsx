
import React, { useState } from 'react';
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
  Home,
  UserCheck,
  Clock,
  TrendingUp,
  Award,
  School
} from 'lucide-react';

const Index = () => {
  const [activeRole, setActiveRole] = useState<'student' | 'teacher' | 'admin'>('student');

  const announcements = [
    {
      id: 1,
      title: "Réunion parents-professeurs",
      content: "Les réunions se dérouleront du 15 au 20 mars. Inscriptions ouvertes.",
      author: "Direction",
      date: "2024-03-01",
      priority: "high",
      category: "Événement"
    },
    {
      id: 2,
      title: "Nouvelle plateforme d'apprentissage",
      content: "Découvrez notre nouvelle plateforme collaborative pour les cours en ligne.",
      author: "Service IT",
      date: "2024-02-28",
      priority: "medium",
      category: "Technologie"
    },
    {
      id: 3,
      title: "Concours de sciences",
      content: "Inscription ouverte pour le concours inter-classes de sciences.",
      author: "Mme. Dubois",
      date: "2024-02-25",
      priority: "low",
      category: "Pédagogie"
    }
  ];

  const upcomingEvents = [
    { id: 1, title: "Conseil de classe 6A", date: "2024-03-15", time: "14:00" },
    { id: 2, title: "Formation numérique", date: "2024-03-18", time: "10:00" },
    { id: 3, title: "Sortie scolaire 5B", date: "2024-03-22", time: "08:30" }
  ];

  const quickStats = {
    student: {
      totalClasses: 8,
      assignmentsDue: 3,
      attendance: 95,
      avgGrade: 14.5
    },
    teacher: {
      totalClasses: 12,
      studentsTotal: 240,
      assignmentsToGrade: 18,
      meetingsToday: 2
    },
    admin: {
      totalStudents: 580,
      totalTeachers: 45,
      pendingRequests: 7,
      systemHealth: 98
    }
  };

  const renderRoleSpecificDashboard = () => {
    switch(activeRole) {
      case 'student':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Cours aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{quickStats.student.totalClasses}</div>
                <p className="text-xs text-blue-600 mt-1">Mathématiques à 14h</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">Devoirs à rendre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{quickStats.student.assignmentsDue}</div>
                <p className="text-xs text-orange-600 mt-1">Prochain: Français demain</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Assiduité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{quickStats.student.attendance}%</div>
                <p className="text-xs text-green-600 mt-1">Excellent!</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Moyenne générale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{quickStats.student.avgGrade}/20</div>
                <p className="text-xs text-purple-600 mt-1">En progression</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'teacher':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indigo-700">Classes gérées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-900">{quickStats.teacher.totalClasses}</div>
                <p className="text-xs text-indigo-600 mt-1">6 niveaux différents</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-700">Élèves total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-900">{quickStats.teacher.studentsTotal}</div>
                <p className="text-xs text-teal-600 mt-1">Répartis sur vos classes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700">À corriger</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{quickStats.teacher.assignmentsToGrade}</div>
                <p className="text-xs text-red-600 mt-1">Copies en attente</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">Réunions aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">{quickStats.teacher.meetingsToday}</div>
                <p className="text-xs text-yellow-600 mt-1">Conseil de classe à 16h</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Élèves total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{quickStats.admin.totalStudents}</div>
                <p className="text-xs text-slate-600 mt-1">Tous niveaux confondus</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">Enseignants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-900">{quickStats.admin.totalTeachers}</div>
                <p className="text-xs text-emerald-600 mt-1">Corps enseignant</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-700">Demandes en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{quickStats.admin.pendingRequests}</div>
                <p className="text-xs text-amber-600 mt-1">À traiter</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-cyan-700">Système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-900">{quickStats.admin.systemHealth}%</div>
                <p className="text-xs text-cyan-600 mt-1">Fonctionnel</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
                <School className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">EcoleNet</h1>
                <p className="text-sm text-slate-600">Intranet Scolaire Collaboratif</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button 
                  variant={activeRole === 'student' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveRole('student')}
                  className="text-xs"
                >
                  Élève
                </Button>
                <Button 
                  variant={activeRole === 'teacher' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveRole('teacher')}
                  className="text-xs"
                >
                  Enseignant
                </Button>
                <Button 
                  variant={activeRole === 'admin' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveRole('admin')}
                  className="text-xs"
                >
                  Administration
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role-specific Dashboard */}
        {renderRoleSpecificDashboard()}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Announcements */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-slate-800">
                  <Bell className="mr-2 h-5 w-5 text-blue-600" />
                  Annonces & Actualités
                </CardTitle>
                <CardDescription>
                  Dernières informations de l'établissement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={announcement.priority === 'high' ? 'destructive' : 
                                 announcement.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {announcement.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm mb-2">{announcement.content}</p>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Par {announcement.author}</span>
                      <span>{new Date(announcement.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageCircle className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="text-xs">Messagerie</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2 text-green-600" />
                    <span className="text-xs">Emploi du temps</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BookOpen className="h-6 w-6 mb-2 text-purple-600" />
                    <span className="text-xs">Cours</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2 text-orange-600" />
                    <span className="text-xs">Documents</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-slate-800">
                  <Calendar className="mr-2 h-4 w-4 text-green-600" />
                  Prochains Événements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-600">{event.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-green-700">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Liens Utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Annuaire
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Résultats
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Award className="mr-2 h-4 w-4" />
                  Activités
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Utilisateurs en ligne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['M. Dupont', 'Mme Martin', 'Sarah L.', 'Alex M.'].map((user, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{user}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
