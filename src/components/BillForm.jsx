import { useState } from 'react';

function BillForm({ onAddBill }) {
  const [bill, setBill] = useState({
    date: '',
    description: '',
    amount: '',
    status: 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBill({
      ...bill,
      id: Date.now(),
      amount: parseFloat(bill.amount)
    });
    setBill({
      date: '',
      description: '',
      amount: '',
      status: 'pending'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ajouter une facture</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={bill.date}
            onChange={(e) => setBill({...bill, date: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={bill.description}
            onChange={(e) => setBill({...bill, description: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Montant</label>
          <input
            type="number"
            step="0.01"
            value={bill.amount}
            onChange={(e) => setBill({...bill, amount: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            value={bill.status}
            onChange={(e) => setBill({...bill, status: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pending">En attente</option>
            <option value="paid">Payée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ajouter la facture
        </button>
      </div>
    </form>
  );
}

export default BillForm; 