
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Mail, MailOpen, Plus, School, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import Navigation from '@/components/Navigation';

const Messages = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Messages simulés pour la démo
  const [messages] = useState([
    {
      id: 1,
      from: 'École Primaire Saint-Martin',
      subject: 'Réunion parents-professeurs',
      content: 'Chers parents, nous organisons une réunion parents-professeurs le 25 janvier à 18h00. Merci de confirmer votre présence.',
      date: '2024-01-15',
      read: false,
      type: 'school'
    },
    {
      id: 2,
      from: 'Mme Dubois - Classe de CM1',
      subject: 'Sortie scolaire au musée',
      content: 'Bonjour, nous organisons une sortie au musée d\'histoire naturelle le 5 février. Authorization parentale requise.',
      date: '2024-01-12',
      read: true,
      type: 'teacher'
    },
    {
      id: 3,
      from: 'Administration',
      subject: 'Rappel - Frais de cantine',
      content: 'Rappel pour le règlement des frais de cantine du mois de janvier. Merci de procéder au paiement avant le 20 janvier.',
      date: '2024-01-10',
      read: true,
      type: 'admin'
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé à l'administration de l'école.",
    });

    setNewMessage({ subject: '', content: '' });
    setShowNewMessage(false);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <School className="h-4 w-4" />;
      case 'teacher':
        return <User className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
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
      <Navigation user={user} profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Communication avec l'école et les enseignants</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Boîte de réception
                  </CardTitle>
                  <Button onClick={() => setShowNewMessage(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau message
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`p-4 border rounded-lg cursor-pointer hover:bg-slate-50 ${!message.read ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getMessageIcon(message.type)}
                        <span className="font-medium text-slate-900">{message.from}</span>
                        {!message.read && <Badge variant="default" className="text-xs">Nouveau</Badge>}
                      </div>
                      <span className="text-sm text-slate-500">{new Date(message.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <h3 className={`font-semibold mb-2 ${!message.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {message.subject}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{message.content}</p>
                    <div className="flex items-center mt-3">
                      {message.read ? (
                        <MailOpen className="h-4 w-4 text-slate-400 mr-1" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-600 mr-1" />
                      )}
                      <span className="text-xs text-slate-500">
                        {message.read ? 'Lu' : 'Non lu'}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Messages non lus</span>
                  <Badge variant="destructive">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total des messages</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacts fréquents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <School className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Administration</p>
                    <p className="text-xs text-slate-500">École Primaire</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <User className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Mme Dubois</p>
                    <p className="text-xs text-slate-500">Enseignante CM1</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">M. Martin</p>
                    <p className="text-xs text-slate-500">Directeur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Nouveau message</CardTitle>
                <CardDescription>
                  Envoyer un message à l'administration ou aux enseignants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Destinataire</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Administration générale</option>
                      <option>Mme Dubois - CM1</option>
                      <option>M. Martin - Directeur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sujet</label>
                    <Input
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Sujet de votre message"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Tapez votre message ici..."
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewMessage(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
