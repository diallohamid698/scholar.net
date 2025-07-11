
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    { id: 1, name: 'M. Dubois', lastMessage: 'Concernant le devoir de maths...', time: '14:30', unread: 2 },
    { id: 2, name: 'Mme Martin', lastMessage: 'Réunion parents-professeurs', time: '12:15', unread: 0 },
    { id: 3, name: 'Direction', lastMessage: 'Nouvelle circulaire', time: '10:45', unread: 1 },
    { id: 4, name: 'Sarah L.', lastMessage: 'On se voit à la cantine ?', time: '09:20', unread: 0 }
  ];

  const messages = [
    { id: 1, sender: 'M. Dubois', content: 'Bonjour, j\'ai regardé votre devoir de mathématiques.', time: '14:25', isOwn: false },
    { id: 2, sender: 'Vous', content: 'Bonjour Monsieur, y a-t-il des corrections à apporter ?', time: '14:28', isOwn: true },
    { id: 3, sender: 'M. Dubois', content: 'Oui, il y a quelques erreurs dans l\'exercice 3. Pouvez-vous le refaire ?', time: '14:30', isOwn: false }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Envoi du message:', newMessage);
      setNewMessage('');
    }
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
            <MessageCircle className="mr-3 h-8 w-8 text-blue-600" />
            Messagerie
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Liste des conversations */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Rechercher..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer hover:bg-slate-50 ${selectedChat === conv.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                    onClick={() => setSelectedChat(conv.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{conv.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm text-slate-900 truncate">{conv.name}</p>
                          <span className="text-xs text-slate-500">{conv.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone de chat */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <span>M. Dubois</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-100 text-slate-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-slate-500'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une conversation pour commencer</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
