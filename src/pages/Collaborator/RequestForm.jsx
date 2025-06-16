import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RequestForm() {
  const [request, setRequest] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'transport',
    justification: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRequest = {
      id: Date.now(),
      ...request,
      amount: parseFloat(request.amount),
      status: 'pending',
      userEmail: user.email,
      userName: user.name,
      date: new Date(request.date).toISOString(),
      submissionDate: new Date().toISOString()
    };

    const savedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    savedRequests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(savedRequests));

    alert('Votre demande a été soumise avec succès !');
    navigate('/collaborator/my-requests');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = [
    { value: 'transport', label: 'Transport' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hôtel' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nouvelle demande de remboursement</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date de la dépense
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={request.date}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            value={request.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Montant (€)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={request.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={request.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez la dépense..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-1">
            Justification
          </label>
          <textarea
            id="justification"
            name="justification"
            value={request.justification}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Justifiez la nécessité de cette dépense..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/collaborator/my-requests')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Soumettre la demande
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestForm; 