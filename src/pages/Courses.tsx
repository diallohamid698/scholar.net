
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  ArrowLeft, 
  Search, 
  Download, 
  Play, 
  FileText, 
  Video, 
  Users, 
  Clock,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  teacher: string;
  subject: string;
  description: string;
  duration: string;
  level: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  resources: number;
  students: number;
  rating: number;
  thumbnail?: string;
}

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'link';
  size?: string;
  duration?: string;
  courseId: number;
}

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const courses: Course[] = [
    {
      id: 1,
      title: 'Algèbre et Géométrie',
      teacher: 'M. Dubois',
      subject: 'Mathématiques',
      description: 'Cours complet sur l\'algèbre et la géométrie pour le niveau 3ème.',
      duration: '2h30',
      level: '3ème',
      status: 'in-progress',
      progress: 65,
      resources: 12,
      students: 28,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Littérature Française',
      teacher: 'Mme Martin',
      subject: 'Français',
      description: 'Étude des grands auteurs français et analyse littéraire.',
      duration: '3h',
      level: '3ème',
      status: 'completed',
      progress: 100,
      resources: 18,
      students: 25,
      rating: 4.6
    },
    {
      id: 3,
      title: 'Histoire Contemporaine',
      teacher: 'M. Rousseau',
      subject: 'Histoire',
      description: 'L\'histoire du 20ème siècle et ses enjeux contemporains.',
      duration: '2h',
      level: '3ème',
      status: 'not-started',
      progress: 0,
      resources: 15,
      students: 30,
      rating: 4.7
    },
    {
      id: 4,
      title: 'Sciences Physiques',
      teacher: 'Mme Leroy',
      subject: 'Sciences',
      description: 'Physique et chimie : les fondamentaux pour le brevet.',
      duration: '2h45',
      level: '3ème',
      status: 'in-progress',
      progress: 30,
      resources: 20,
      students: 26,
      rating: 4.5
    },
    {
      id: 5,
      title: 'Anglais Conversationnel',
      teacher: 'Ms Johnson',
      subject: 'Anglais',
      description: 'Améliorer sa communication orale en anglais.',
      duration: '1h30',
      level: '3ème',
      status: 'in-progress',
      progress: 45,
      resources: 8,
      students: 24,
      rating: 4.9
    }
  ];

  const resources: Resource[] = [
    { id: 1, title: 'Cours - Équations du second degré', type: 'pdf', size: '2.3 MB', courseId: 1 },
    { id: 2, title: 'Vidéo - Théorème de Pythagore', type: 'video', duration: '15 min', courseId: 1 },
    { id: 3, title: 'Exercices - Géométrie dans l\'espace', type: 'pdf', size: '1.8 MB', courseId: 1 },
    { id: 4, title: 'Analyse - Le Rouge et le Noir', type: 'pdf', size: '3.2 MB', courseId: 2 },
    { id: 5, title: 'Audio - Lecture de Baudelaire', type: 'audio', duration: '12 min', courseId: 2 },
  ];

  const subjects = ['all', 'Mathématiques', 'Français', 'Histoire', 'Sciences', 'Anglais'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getStatusIcon = (status: Course['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Course['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      default:
        return 'Non commencé';
    }
  };

  const handleDownloadResource = (resource: Resource) => {
    toast({
      title: "Téléchargement commencé",
      description: `${resource.title} est en cours de téléchargement.`,
    });
  };

  const handleStartCourse = (course: Course) => {
    toast({
      title: "Cours lancé",
      description: `Vous avez accédé au cours "${course.title}".`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
            Cours et Ressources
          </h1>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un cours..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject === 'all' ? 'Toutes les matières' : subject}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">Mes Cours</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-all hover-scale">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{course.teacher}</p>
                      </div>
                      <Badge variant="secondary">{course.subject}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 mb-4">{course.description}</p>
                    
                    {/* Barre de progression */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-600">Progression</span>
                        <span className="text-xs font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {course.students}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    </div>

                    {/* Statut */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(course.status)}
                        <span className="text-sm">{getStatusText(course.status)}</span>
                      </div>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleStartCourse(course)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {course.status === 'not-started' ? 'Commencer' : 'Continuer'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resources.map((resource) => {
                const course = courses.find(c => c.id === resource.courseId);
                return (
                  <Card key={resource.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {resource.type === 'pdf' && <FileText className="h-5 w-5 text-red-500" />}
                          {resource.type === 'video' && <Video className="h-5 w-5 text-blue-500" />}
                          {resource.type === 'audio' && <Play className="h-5 w-5 text-green-500" />}
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-xs text-slate-600">
                              {course?.subject} • {resource.size || resource.duration}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadResource(resource)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;
