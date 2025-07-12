
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  student_number: string;
  class_level: string;
  date_of_birth?: string;
  status: string;
}

interface StudentManagerProps {
  students: Student[];
  onStudentAdded: () => void;
  onStudentUpdated: () => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ students, onStudentAdded, onStudentUpdated }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    classLevel: '',
    dateOfBirth: ''
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      studentNumber: '',
      classLevel: '',
      dateOfBirth: ''
    });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('students')
        .insert({
          parent_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          student_number: formData.studentNumber,
          class_level: formData.classLevel,
          date_of_birth: formData.dateOfBirth || null
        });

      if (error) throw error;

      toast({
        title: "Étudiant ajouté",
        description: "L'étudiant a été ajouté avec succès.",
      });

      resetForm();
      setIsAddDialogOpen(false);
      onStudentAdded();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          student_number: formData.studentNumber,
          class_level: formData.classLevel,
          date_of_birth: formData.dateOfBirth || null
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      toast({
        title: "Étudiant modifié",
        description: "Les informations ont été mises à jour.",
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingStudent(null);
      onStudentUpdated();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.first_name,
      lastName: student.last_name,
      studentNumber: student.student_number,
      classLevel: student.class_level,
      dateOfBirth: student.date_of_birth || ''
    });
    setIsEditDialogOpen(true);
  };

  const renderForm = (isEdit: boolean = false) => (
    <form onSubmit={isEdit ? handleEditStudent : handleAddStudent} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="studentNumber">Numéro étudiant</Label>
        <Input
          id="studentNumber"
          value={formData.studentNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="classLevel">Classe</Label>
        <Select 
          value={formData.classLevel} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, classLevel: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6A">6ème A</SelectItem>
            <SelectItem value="6B">6ème B</SelectItem>
            <SelectItem value="5A">5ème A</SelectItem>
            <SelectItem value="5B">5ème B</SelectItem>
            <SelectItem value="4A">4ème A</SelectItem>
            <SelectItem value="4B">4ème B</SelectItem>
            <SelectItem value="3A">3ème A</SelectItem>
            <SelectItem value="3B">3ème B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date de naissance (optionnel)</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Ajouter')}
      </Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestion des étudiants</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un enfant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un enfant</DialogTitle>
              <DialogDescription>
                Ajoutez les informations de votre enfant pour le suivi scolaire.
              </DialogDescription>
            </DialogHeader>
            {renderForm()}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{student.first_name} {student.last_name}</h4>
                  <p className="text-sm text-slate-600">Classe: {student.class_level}</p>
                  <p className="text-xs text-slate-500">N° {student.student_number}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(student)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les informations</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre enfant.
            </DialogDescription>
          </DialogHeader>
          {renderForm(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManager;
