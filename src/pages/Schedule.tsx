
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ArrowLeft, ChevronLeft, ChevronRight, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScheduleEvent {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  time: string;
  duration: string;
  type: 'course' | 'exam' | 'meeting' | 'break';
  color: string;
}

interface DaySchedule {
  date: string;
  day: string;
  events: ScheduleEvent[];
}

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const getWeekSchedule = (weekOffset: number): DaySchedule[] => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + weekOffset * 7);
    
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1); // Lundi

    const schedule: DaySchedule[] = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      
      schedule.push({
        date: currentDate.toLocaleDateString('fr-FR'),
        day: days[i],
        events: generateDayEvents(i)
      });
    }

    return schedule;
  };

  const generateDayEvents = (dayIndex: number): ScheduleEvent[] => {
    const baseEvents = [
      { id: 1, subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 101', time: '08:00', duration: '2h', type: 'course' as const, color: 'bg-blue-100 text-blue-800' },
      { id: 2, subject: 'Français', teacher: 'Mme Martin', room: 'Salle 203', time: '10:15', duration: '1h30', type: 'course' as const, color: 'bg-green-100 text-green-800' },
      { id: 3, subject: 'Récréation', teacher: '', room: 'Cour', time: '11:45', duration: '15min', type: 'break' as const, color: 'bg-gray-100 text-gray-800' },
      { id: 4, subject: 'Histoire-Géo', teacher: 'M. Rousseau', room: 'Salle 105', time: '14:00', duration: '2h', type: 'course' as const, color: 'bg-purple-100 text-purple-800' },
      { id: 5, subject: 'Sciences', teacher: 'Mme Leroy', room: 'Lab 1', time: '16:15', duration: '1h', type: 'course' as const, color: 'bg-orange-100 text-orange-800' }
    ];

    // Varier les cours selon le jour
    const variations = [
      [0, 1, 2, 3], // Lundi
      [1, 3, 4], // Mardi
      [0, 2, 4], // Mercredi
      [1, 2, 3, 4], // Jeudi
      [0, 3] // Vendredi
    ];

    return variations[dayIndex]?.map(index => baseEvents[index]) || [];
  };

  const weekSchedule = getWeekSchedule(currentWeek);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? prev - 1 : prev + 1);
    setSelectedDay(null);
  };

  const getWeekRange = () => {
    const firstDay = weekSchedule[0]?.date;
    const lastDay = weekSchedule[4]?.date;
    return `${firstDay} - ${lastDay}`;
  };

  const getTotalHours = () => {
    return weekSchedule.reduce((total, day) => {
      return total + day.events.filter(event => event.type === 'course').length * 1.5;
    }, 0);
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
            <Calendar className="mr-3 h-8 w-8 text-blue-600" />
            Emploi du temps
          </h1>
        </div>

        {/* En-tête de navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Semaine du {getWeekRange()}</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  {getTotalHours()}h de cours • 5 jours
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentWeek(0)}
                  className={currentWeek === 0 ? 'bg-blue-50' : ''}
                >
                  Aujourd'hui
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Grille de l'emploi du temps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weekSchedule.map((daySchedule) => (
            <Card key={daySchedule.day} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{daySchedule.day}</span>
                  <Badge variant="secondary" className="text-xs">
                    {daySchedule.events.length} cours
                  </Badge>
                </CardTitle>
                <p className="text-sm text-slate-600">{daySchedule.date}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {daySchedule.events.length > 0 ? (
                  daySchedule.events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${event.color} hover:shadow-md transition-all cursor-pointer hover-scale`}
                      onClick={() => setSelectedDay(selectedDay === `${daySchedule.day}-${event.id}` ? null : `${daySchedule.day}-${event.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{event.subject}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.duration}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                        {event.teacher && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.teacher}
                          </div>
                        )}
                        {event.room && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.room}
                          </div>
                        )}
                      </div>
                      
                      {/* Détails étendus */}
                      {selectedDay === `${daySchedule.day}-${event.id}` && (
                        <div className="mt-3 pt-3 border-t border-current/20 animate-fade-in">
                          <div className="flex items-center space-x-2 text-xs">
                            <BookOpen className="h-3 w-3" />
                            <span>Cours magistral • Présence obligatoire</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun cours prévu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistiques */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getTotalHours()}h</div>
              <p className="text-xs text-slate-600">de cours programmés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Prochains examens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-slate-600">évaluations à venir</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Charge de travail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Normal</div>
              <p className="text-xs text-slate-600">répartition équilibrée</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
