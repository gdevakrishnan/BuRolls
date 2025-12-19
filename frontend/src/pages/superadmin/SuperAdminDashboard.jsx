import React, { useEffect, useState } from 'react';
import { getOverview, getStats } from '../../serviceWorkers/adminServices';

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOverview()
      .then((res) => setData(res.data || res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    getStats().then((res) => setStats(res || res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Business Units</h3>
            <div className="text-2xl font-bold">{stats.businessUnits}</div>
          </div>
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Managers</h3>
            <div className="text-2xl font-bold">{stats.managers}</div>
          </div>
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Companies</h3>
            <div className="text-2xl font-bold">{stats.companies}</div>
          </div>
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Users</h3>
            <div className="text-2xl font-bold">{stats.users}</div>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {data && (
        <div className="space-y-6">
          {data.data?.map((bu) => (
            <div key={bu._id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{bu.name}</h2>
              <p className="text-sm text-gray-600">Managers: {bu.managers?.length}</p>
              <p className="text-sm text-gray-600">Companies: {bu.companies?.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
