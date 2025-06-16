import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function DashboardStats({ bills }) {
  // Calcul des statistiques
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  // Données pour le graphique en anneau des statuts
  const statusData = {
    labels: ['Payées', 'En attente', 'Annulées'],
    datasets: [{
      data: [
        bills.filter(bill => bill.status === 'paid').length,
        bills.filter(bill => bill.status === 'pending').length,
        bills.filter(bill => bill.status === 'cancelled').length
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  // Données pour le graphique en barres des montants par mois
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('fr-FR', { month: 'long' });
  }).reverse();

  const monthlyData = {
    labels: last6Months,
    datasets: [{
      label: 'Montant des factures',
      data: last6Months.map(month => {
        const monthBills = bills.filter(bill => {
          const billDate = new Date(bill.date);
          return billDate.toLocaleString('fr-FR', { month: 'long' }) === month;
        });
        return monthBills.reduce((sum, bill) => sum + bill.amount, 0);
      }),
      backgroundColor: '#3B82F6',
      borderRadius: 5
    }]
  };

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Total des factures</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalAmount.toFixed(2)} €</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Factures payées</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{paidAmount.toFixed(2)} €</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900">Factures en attente</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingAmount.toFixed(2)} €</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des statuts</h3>
          <div className="h-64">
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Montants par mois</h3>
          <div className="h-64">
            <Bar
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: value => value + ' €'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats; 