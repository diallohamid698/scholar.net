
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, BookOpen, School } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import Navigation from '@/components/Navigation';

const Schedule = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // Données simulées pour le planning
  const [events] = useState([
    {
      id: 1,
      title: 'Cours de Mathématiques',
      type: 'course',
      date: '2024-01-15',
      time: '08:30 - 09:30',
      location: 'Salle 12',
      teacher: 'Mme Dubois',
      description: 'Révision des fractions'
    },
    {
      id: 2,
      title: 'Réunion parents-professeurs',
      type: 'meeting',
      date: '2024-01-15',
      time: '18:00 - 20:00',
      location: 'Salle polyvalente',
      teacher: 'Équipe pédagogique',
      description: 'Bilan du trimestre'
    },
    {
      id: 3,
      title: 'Sortie au musée',
      type: 'trip',
      date: '2024-01-18',
      time: '09:00 - 16:00',
      location: 'Musée d\'Histoire Naturelle',
      teacher: 'M. Martin',
      description: 'Visite guidée sur les dinosaures'
    },
    {
      id: 4,
      title: 'Cours de Sport',
      type: 'sport',
      date: '2024-01-16',
      time: '14:00 - 15:00',
      location: 'Gymnase',
      teacher: 'M. Leblanc',
      description: 'Basketball'
    },
    {
      id: 5,
      title: 'Conseil de classe',
      type: 'meeting',
      date: '2024-01-20',
      time: '17:00 - 18:30',
      location: 'Salle des professeurs',
      teacher: 'Équipe pédagogique',
      description: 'Bilan des élèves'
    }
  ]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate('/login');
        } else {
          fetchUserData(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
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
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'trip':
        return <MapPin className="h-4 w-4" />;
      case 'sport':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'trip':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sport':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'course':
        return 'Cours';
      case 'meeting':
        return 'Réunion';
      case 'trip':
        return 'Sortie';
      case 'sport':
        return 'Sport';
      default:
        return 'Événement';
    }
  };

  // Générer le calendrier du mois
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Jours vides du début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      days.push({ day, date: dateStr, events: dayEvents });
    }
    
    return days;
  };

  const todayEvents = events.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.date === today;
  });

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).slice(0, 5);

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

  const calendarDays = generateCalendar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation user={user} profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Planning scolaire</h1>
          <p className="text-slate-600">Calendrier des cours, événements et activités</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                      className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => setSelectedDate(new Date())}
                      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                    >
                      Aujourd'hui
                    </button>
                    <button 
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                      className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded"
                    >
                      →
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="min-h-24 p-1">
                      {day && (
                        <div className={`h-full p-2 rounded border ${day.events.length > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
                          <div className="text-sm font-medium mb-1">{day.day}</div>
                          {day.events.slice(0, 2).map(event => (
                            <div key={event.id} className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded mb-1 truncate">
                              {event.title}
                            </div>
                          ))}
                          {day.events.length > 2 && (
                            <div className="text-xs text-slate-500">+{day.events.length - 2} autre(s)</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Événements du jour */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                {todayEvents.length > 0 ? (
                  <div className="space-y-3">
                    {todayEvents.map(event => (
                      <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}>
                        <div className="flex items-center mb-2">
                          {getEventTypeIcon(event.type)}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {getEventTypeName(event.type)}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="flex items-center text-xs text-slate-600 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-4">Aucun événement aujourd'hui</p>
                )}
              </CardContent>
            </Card>

            {/* Prochains événements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prochains événements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {getEventTypeName(event.type)}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {new Date(event.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                    <div className="flex items-center text-xs text-slate-600">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-xs text-slate-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Légende */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Légende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span className="text-sm">Cours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-600 rounded"></div>
                  <span className="text-sm">Réunions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span className="text-sm">Sorties</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-600 rounded"></div>
                  <span className="text-sm">Sport</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
