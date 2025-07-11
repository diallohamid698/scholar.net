
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  ArrowLeft, 
  Search, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  Share2,
  Filter,
  Calendar,
  User,
  FolderOpen,
  File,
  Image,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
  size: string;
  dateModified: string;
  author: string;
  category: string;
  shared: boolean;
  favorite: boolean;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { toast } = useToast();

  const documents: Document[] = [
    {
      id: 1,
      name: 'Cours_Mathematiques_Chapitre_5.pdf',
      type: 'pdf',
      size: '2.3 MB',
      dateModified: '2024-03-10',
      author: 'M. Dubois',
      category: 'Cours',
      shared: true,
      favorite: false
    },
    {
      id: 2,
      name: 'Devoir_Francais_Analyse_Litteraire.doc',
      type: 'doc',
      size: '1.8 MB',
      dateModified: '2024-03-08',
      author: 'Moi',
      category: 'Devoirs',
      shared: false,
      favorite: true
    },
    {
      id: 3,
      name: 'Presentation_Histoire_Guerre_Mondiale.pdf',
      type: 'pdf',
      size: '5.2 MB',
      dateModified: '2024-03-07',
      author: 'M. Rousseau',
      category: 'Presentations',
      shared: true,
      favorite: false
    },
    {
      id: 4,
      name: 'Rapport_Sortie_Scolaire.pdf',
      type: 'pdf',
      size: '1.5 MB',
      dateModified: '2024-03-05',
      author: 'Mme Martin',
      category: 'Rapports',
      shared: false,
      favorite: false
    },
    {
      id: 5,
      name: 'Schema_Sciences_Physiques.jpg',
      type: 'image',
      size: '450 KB',
      dateModified: '2024-03-03',
      author: 'Mme Leroy',
      category: 'Images',
      shared: true,
      favorite: true
    },
    {
      id: 6,
      name: 'Video_Anglais_Conversation.mp4',
      type: 'video',
      size: '15.7 MB',
      dateModified: '2024-03-01',
      author: 'Ms Johnson',
      category: 'Videos',
      shared: true,
      favorite: false
    }
  ];

  const categories = ['all', 'Cours', 'Devoirs', 'Presentations', 'Rapports', 'Images', 'Videos'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownload = (document: Document) => {
    toast({
      title: "Téléchargement commencé",
      description: `${document.name} est en cours de téléchargement.`,
    });
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
    toast({
      title: "Document ouvert",
      description: `Consultation de ${document.name}`,
    });
  };

  const handleShare = (document: Document) => {
    toast({
      title: "Lien de partage copié",
      description: `Le lien de partage pour ${document.name} a été copié dans le presse-papiers.`,
    });
  };

  const handleDelete = (document: Document) => {
    toast({
      title: "Document supprimé",
      description: `${document.name} a été supprimé avec succès.`,
      variant: "destructive"
    });
  };

  const handleUpload = () => {
    toast({
      title: "Fonction à venir",
      description: "La fonctionnalité d'upload sera bientôt disponible.",
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
            <FolderOpen className="mr-3 h-8 w-8 text-blue-600" />
            Documents et Fichiers
          </h1>
        </div>

        {/* Barre d'outils */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleUpload} className="hover-scale">
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Tous les documents' : category}
                </Button>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="grid">Grille</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents ({filteredDocuments.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b last:border-b-0"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(document.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{document.name}</h4>
                          <div className="flex items-center space-x-4 text-xs text-slate-600 mt-1">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {document.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(document.dateModified).toLocaleDateString('fr-FR')}
                            </div>
                            <span>{document.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={document.shared ? "default" : "secondary"}>
                          {document.category}
                        </Badge>
                        {document.shared && (
                          <Badge variant="outline" className="text-green-600">
                            Partagé
                          </Badge>
                        )}
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleView(document)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(document)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShare(document)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(document)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-all hover-scale">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      {getFileIcon(document.type)}
                      <Badge variant="outline">{document.category}</Badge>
                    </div>
                    
                    <h4 className="font-medium text-sm truncate mb-2">{document.name}</h4>
                    
                    <div className="text-xs text-slate-600 space-y-1 mb-3">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {document.author}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(document.dateModified).toLocaleDateString('fr-FR')}
                        </div>
                        <span>{document.size}</span>
                      </div>
                    </div>

                    {document.shared && (
                      <Badge variant="outline" className="text-green-600 mb-3">
                        Partagé
                      </Badge>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(document)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleShare(document)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(document)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Statistiques */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                <p className="text-xs text-slate-600">Documents total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.shared).length}
                </div>
                <p className="text-xs text-slate-600">Documents partagés</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(documents.reduce((acc, doc) => acc + parseFloat(doc.size.replace(/[^\d.]/g, '')), 0))}
                </div>
                <p className="text-xs text-slate-600">MB utilisés</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {documents.filter(d => d.favorite).length}
                </div>
                <p className="text-xs text-slate-600">Favoris</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documents;
