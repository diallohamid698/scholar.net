
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, CheckCircle, AlertTriangle, Clock, Euro } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  payment_date: string;
  notes?: string;
  student_fee_id: string;
}

interface StudentFee {
  id: string;
  amount: number;
  due_date: string;
  status: string;
  fee_types: {
    name: string;
    category: string;
  };
  students: {
    first_name: string;
    last_name: string;
  };
}

interface PaymentManagerProps {
  studentFees: StudentFee[];
  onPaymentMade: () => void;
}

const PaymentManager: React.FC<PaymentManagerProps> = ({ studentFees, onPaymentMade }) => {
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
      } else {
        setPayments(data || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;
    
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Créer le paiement
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          parent_id: user.id,
          student_fee_id: selectedFee.id,
          amount: selectedFee.amount,
          payment_method: paymentData.paymentMethod,
          notes: paymentData.notes,
          status: 'completed',
          payment_date: new Date().toISOString()
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Paiement effectué",
        description: "Votre paiement a été enregistré avec succès.",
      });

      setPaymentData({ paymentMethod: '', notes: '' });
      setIsPaymentDialogOpen(false);
      setSelectedFee(null);
      onPaymentMade();
      fetchPayments();
    } catch (error: any) {
      toast({
        title: "Erreur de paiement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentDialog = (fee: StudentFee) => {
    setSelectedFee(fee);
    setIsPaymentDialogOpen(true);
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    if (status === 'paid') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === 'pending' && new Date(dueDate) < new Date()) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-orange-600" />;
  };

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'paid') return 'Payé';
    if (status === 'pending' && new Date(dueDate) < new Date()) return 'En retard';
    return 'À payer';
  };

  const getStatusVariant = (status: string, dueDate: string): "default" | "destructive" | "secondary" => {
    if (status === 'paid') return 'default';
    if (status === 'pending' && new Date(dueDate) < new Date()) return 'destructive';
    return 'secondary';
  };

  const pendingFees = studentFees.filter(fee => fee.status === 'pending');
  const overdueFees = pendingFees.filter(fee => new Date(fee.due_date) < new Date());
  const upcomingFees = pendingFees.filter(fee => new Date(fee.due_date) >= new Date());

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">En retard</p>
                <p className="text-2xl font-bold text-red-600">{overdueFees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">À venir</p>
                <p className="text-2xl font-bold text-orange-600">{upcomingFees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total à payer</p>
                <p className="text-2xl font-bold text-blue-600">
                  {pendingFees.reduce((total, fee) => total + parseFloat(fee.amount.toString()), 0).toFixed(2)} €
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fees List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Frais scolaires
          </CardTitle>
          <CardDescription>
            Gérez et payez les frais scolaires de vos enfants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {studentFees.length > 0 ? (
            studentFees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(fee.status, fee.due_date)}
                  <div>
                    <h4 className="font-semibold">
                      {fee.fee_types?.name} - {fee.students?.first_name} {fee.students?.last_name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {fee.amount} € - Échéance: {new Date(fee.due_date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-slate-500">Catégorie: {fee.fee_types?.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusVariant(fee.status, fee.due_date)}>
                    {getStatusText(fee.status, fee.due_date)}
                  </Badge>
                  {fee.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => openPaymentDialog(fee)}
                    >
                      Payer
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600">Aucun frais scolaire à afficher</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-2">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{payment.amount} €</p>
                    <p className="text-sm text-slate-600">{payment.payment_method}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">Payé</Badge>
                    <p className="text-xs text-slate-500">
                      {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-4">Aucun paiement effectué</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Effectuer un paiement</DialogTitle>
            <DialogDescription>
              {selectedFee && (
                <>
                  Paiement de {selectedFee.amount} € pour {selectedFee.fee_types?.name} - {selectedFee.students?.first_name} {selectedFee.students?.last_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">Méthode de paiement</Label>
              <Select 
                value={paymentData.paymentMethod} 
                onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMethod: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="transfer">Virement bancaire</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes sur ce paiement..."
                value={paymentData.notes}
                onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Traitement...' : 'Confirmer le paiement'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManager;
