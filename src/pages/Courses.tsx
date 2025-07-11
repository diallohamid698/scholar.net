
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Video, Download, ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

type Course = {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  date: string;
  type: 'document' | 'video' | 'exercise';
  description: string;
  fileSize?: string;
};

const Courses = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = [
    { id: 'all', name: 'Tous les cours', color: 'bg-slate-100' },
    { id: 'math', name: 'Mathématiques', color: 'bg-blue-100' },
    { id: 'french', name: 'Français', color: 'bg-green-100' },
    { id: 'history', name: 'Histoire-Géo', color: 'bg-yellow-100' },
    { id: 'science', name: 'Sciences', color: 'bg-purple-100' },
    { id: 'english', name: 'Anglais', color: 'bg-red-100' }
  ];

  const courses: Course[] = [
    {
      id: 1,
      title: 'Les équations du second degré',
      subject: 'math',
      teacher: 'M. Dubois',
      date: '2024-03-10',
      type: 'document',
      description: 'Cours complet sur les équations du second degré avec exercices',
      fileSize: '2.3 MB'
    },
    {
      id: 2,
      title: 'L\'analyse de texte littéraire',
      subject: 'french',
      teacher: 'Mme Martin',
      date: '2024-03-09',
      type: 'video',
      description: 'Méthodologie pour analyser un texte littéraire',
      fileSize: '45 MB'
    },
    {
      id: 3,
      title: 'La Révolution Française',
      subject: 'history',
      teacher: 'M. Bernard',
      date: '2024-03-08',
      type: 'document',
      description: 'Synthèse sur les causes et conséquences de la Révolution',
      fileSize: '1.8 MB'
    },
    {
      id: 4,
      title: 'Exercices : Les fractions',
      subject: 'math',
      teacher: 'M. Dubois',
      date: '2024-03-07',
      type: 'exercise',
      description: 'Série d\'exercices sur les opérations avec les fractions'
    },
    {
      id: 5,
      title: 'Present Perfect vs Past Simple',
      subject: 'english',
      teacher: 'Mme Johnson',
      date: '2024-03-06',
      type: 'video',
      description: 'Différences et usages des temps en anglais',
      fileSize: '32 MB'
    },
    {
      id: 6,
      title: 'Les réactions chimiques',
      subject: 'science',
      teacher: 'M. Lavoisier',
      date: '2024-03-05',
      type: 'document',
      description: 'Introduction aux réactions chimiques de base',
      fileSize: '3.1 MB'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'exercise': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = selectedSubject === 'all' 
    ? courses 
    : courses.filter(course => course.subject === selectedSubject);

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
            Mes Cours
          </h1>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {subjects.map((subject) => (
              <TabsTrigger key={subject.id} value={subject.id} className="text-sm">
                {subject.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => (
            <TabsContent key={subject.id} value={subject.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(subject.id === 'all' ? courses : courses.filter(c => c.subject === subject.id)).map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(course.type)}
                          <Badge className={getTypeColor(course.type)}>
                            {course.type === 'document' && 'Document'}
                            {course.type === 'video' && 'Vidéo'}
                            {course.type === 'exercise' && 'Exercice'}
                          </Badge>
                        </div>
                        {course.fileSize && (
                          <span className="text-xs text-slate-500">{course.fileSize}</span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="text-sm text-slate-600">
                        <p>{course.teacher}</p>
                        <p>{new Date(course.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700 mb-4">{course.description}</p>
                      <div className="flex space-x-2">
                        {course.type === 'video' ? (
                          <Button size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Regarder
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {filteredCourses.length === 0 && (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun cours disponible</h3>
            <p className="text-slate-600">Les cours pour cette matière seront bientôt disponibles.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;
