import { useState, useEffect } from 'react';
import BillForm from '../components/BillForm';
import BillTable from '../components/BillTable';
import EditBillModal from '../components/EditBillModal';

function Bills() {
  const [bills, setBills] = useState(() => {
    const savedBills = localStorage.getItem('bills');
    return savedBills ? JSON.parse(savedBills) : [];
  });
  const [editingBill, setEditingBill] = useState(null);

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  const handleAddBill = (newBill) => {
    setBills([...bills, newBill]);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
  };

  const handleSaveEdit = (editedBill) => {
    setBills(bills.map(bill => 
      bill.id === editedBill.id ? editedBill : bill
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des factures</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <BillForm onAddBill={handleAddBill} />
        </div>
        <div>
          <BillTable bills={bills} onEditBill={handleEditBill} />
        </div>
      </div>
      {editingBill && (
        <EditBillModal
          bill={editingBill}
          onClose={() => setEditingBill(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default Bills; 