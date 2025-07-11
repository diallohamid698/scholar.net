
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, Filter, ArrowLeft, File, Image, FileVideo } from 'lucide-react';
import { Link } from 'react-router-dom';

type Document = {
  id: number;
  name: string;
  type: 'pdf' | 'doc' | 'img' | 'video';
  size: string;
  date: string;
  category: string;
  author: string;
};

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const documents: Document[] = [
    {
      id: 1,
      name: 'Règlement intérieur 2024.pdf',
      type: 'pdf',
      size: '1.2 MB',
      date: '2024-03-01',
      category: 'administration',
      author: 'Direction'
    },
    {
      id: 2,
      name: 'Calendrier scolaire.pdf',
      type: 'pdf',
      size: '856 KB',
      date: '2024-02-28',
      category: 'administration',
      author: 'Secrétariat'
    },
    {
      id: 3,
      name: 'Formulaire autorisation sortie.doc',
      type: 'doc',
      size: '245 KB',
      date: '2024-02-25',
      category: 'formulaires',
      author: 'Vie scolaire'
    },
    {
      id: 4,
      name: 'Plan de l\'établissement.jpg',
      type: 'img',
      size: '2.1 MB',
      date: '2024-02-20',
      category: 'informations',
      author: 'Administration'
    },
    {
      id: 5,
      name: 'Présentation orientation 3ème.pdf',
      type: 'pdf',
      size: '3.4 MB',
      date: '2024-02-15',
      category: 'orientation',
      author: 'Conseiller d\'orientation'
    },
    {
      id: 6,
      name: 'Vidéo présentation établissement.mp4',
      type: 'video',
      size: '25.6 MB',
      date: '2024-02-10',
      category: 'informations',
      author: 'Communication'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous les documents', count: documents.length },
    { id: 'administration', name: 'Administration', count: documents.filter(d => d.category === 'administration').length },
    { id: 'formulaires', name: 'Formulaires', count: documents.filter(d => d.category === 'formulaires').length },
    { id: 'informations', name: 'Informations', count: documents.filter(d => d.category === 'informations').length },
    { id: 'orientation', name: 'Orientation', count: documents.filter(d => d.category === 'orientation').length }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'img': return <Image className="h-5 w-5 text-green-500" />;
      case 'video': return <FileVideo className="h-5 w-5 text-purple-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'doc': return 'bg-blue-100 text-blue-800';
      case 'img': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <FileText className="mr-3 h-8 w-8 text-blue-600" />
            Documents
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec filtres */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un document..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Catégories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Liste des documents */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} trouvé{filteredDocuments.length > 1 ? 's' : ''}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        {getFileIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                            <span>{doc.author}</span>
                            <span>•</span>
                            <span>{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getTypeColor(doc.type)}>
                          {doc.type.toUpperCase()}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun document trouvé</h3>
                    <p className="text-slate-600">
                      {searchTerm ? 'Essayez de modifier votre recherche.' : 'Aucun document dans cette catégorie.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
