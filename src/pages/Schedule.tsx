
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Event = {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  time: string;
  duration: number;
  type: 'course' | 'exam' | 'meeting';
};

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const schedule: { [key: string]: Event[] } = {
    'Lundi': [
      { id: 1, subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 101', time: '08:00', duration: 2, type: 'course' },
      { id: 2, subject: 'Français', teacher: 'Mme Martin', room: 'Salle 205', time: '10:00', duration: 1, type: 'course' },
      { id: 3, subject: 'Histoire-Géo', teacher: 'M. Bernard', room: 'Salle 302', time: '14:00', duration: 2, type: 'course' }
    ],
    'Mardi': [
      { id: 4, subject: 'Anglais', teacher: 'Mme Johnson', room: 'Salle 108', time: '09:00', duration: 1, type: 'course' },
      { id: 5, subject: 'Sciences', teacher: 'M. Lavoisier', room: 'Labo 1', time: '10:00', duration: 2, type: 'course' },
      { id: 6, subject: 'EPS', teacher: 'M. Sport', room: 'Gymnase', time: '15:00', duration: 2, type: 'course' }
    ],
    'Mercredi': [
      { id: 7, subject: 'Contrôle Maths', teacher: 'M. Dubois', room: 'Salle 101', time: '08:00', duration: 2, type: 'exam' },
      { id: 8, subject: 'Arts Plastiques', teacher: 'Mme Picasso', room: 'Atelier', time: '10:00', duration: 2, type: 'course' }
    ],
    'Jeudi': [
      { id: 9, subject: 'Français', teacher: 'Mme Martin', room: 'Salle 205', time: '08:00', duration: 1, type: 'course' },
      { id: 10, subject: 'Musique', teacher: 'M. Mozart', room: 'Salle de musique', time: '09:00', duration: 1, type: 'course' },
      { id: 11, subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 101', time: '14:00', duration: 2, type: 'course' }
    ],
    'Vendredi': [
      { id: 12, subject: 'Sciences', teacher: 'M. Lavoisier', room: 'Labo 1', time: '08:00', duration: 2, type: 'course' },
      { id: 13, subject: 'Réunion Classe', teacher: 'Prof Principal', room: 'Salle 205', time: '16:00', duration: 1, type: 'meeting' }
    ]
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'exam': return 'bg-red-100 border-red-300 text-red-800';
      case 'meeting': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getEventPosition = (time: string, duration: number) => {
    const startHour = parseInt(time.split(':')[0]);
    const top = (startHour - 8) * 60; // 60px par heure
    const height = duration * 60;
    return { top, height };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-blue-600" />
              Emploi du Temps
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              Semaine du {new Date(Date.now() + currentWeek * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
            </span>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Planning de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {/* En-tête avec les heures */}
              <div className="space-y-4">
                <div className="h-12"></div> {/* Espace pour l'en-tête des jours */}
                {timeSlots.map((time) => (
                  <div key={time} className="h-14 flex items-center text-sm text-slate-600 font-medium">
                    {time}
                  </div>
                ))}
              </div>

              {/* Colonnes pour chaque jour */}
              {weekDays.map((day) => (
                <div key={day} className="space-y-4">
                  <div className="h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="font-semibold text-slate-900">{day}</span>
                  </div>
                  
                  <div className="relative" style={{ height: `${timeSlots.length * 60}px` }}>
                    {schedule[day]?.map((event) => {
                      const { top, height } = getEventPosition(event.time, event.duration);
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-0 right-0 mx-1 p-2 rounded border ${getEventColor(event.type)} cursor-pointer hover:shadow-md transition-shadow`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="text-xs font-semibold truncate">{event.subject}</div>
                          <div className="text-xs text-slate-600 truncate flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                          <div className="text-xs text-slate-600 truncate flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.room}
                          </div>
                          <div className="text-xs text-slate-600 truncate">{event.teacher}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Légende */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Légende</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm">Cours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm">Contrôle/Examen</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm">Réunion</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
