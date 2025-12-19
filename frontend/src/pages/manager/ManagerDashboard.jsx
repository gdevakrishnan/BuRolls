import React, { useEffect, useState } from 'react';
import { getManagerCompanies } from '../../serviceWorkers/managerServices';
import { Link } from 'react-router-dom';

export default function ManagerDashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [assignedBus, setAssignedBus] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setLoading(true);
    getManagerCompanies()
      .then((res) => setCompanies(res.companies || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    // load assigned business units, users, stats and invoices
    import('../../serviceWorkers/managerServices').then(({ getAssignedBusinessUnits, getStats, getUsers, getManagerInvoices }) => {
      getAssignedBusinessUnits().then((r)=> setAssignedBus(r.businessUnits || [])).catch(()=>{});
      getStats().then((s)=> setStats(s || {})).catch(()=>{});
      getUsers().then((r)=> setUsers(r.users || [])).catch(()=>{});
      getManagerInvoices().then((r)=> setInvoices(r.invoices || [])).catch(()=>{});
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Companies</h3>
          <div className="text-sm text-blue-600">
            <Link to={'/manager/companies'}>View more</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {companies.slice(0,5).map(c => (
            <div key={c._id} className="border p-3 rounded">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-500">Status: {c.status}</div>
            </div>
          ))}
        </div>
        <div className="text-sm"><Link to={'/manager/companies/create'} className="text-blue-600" href="">Create Company</Link></div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Users</h3>
          <div className="text-sm text-blue-600">
            <Link to={'/manager/users'}>View more</Link>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {users.slice(0,5).map(u => (
            <div key={u._id} className="border p-3 rounded">
              <div className="font-semibold">{u.name} <span className="text-sm text-gray-500">({u.email})</span></div>
              <div className="text-sm text-gray-500">Company: {u.company?.name}</div>
            </div>
          ))}
        </div>
        <div className="text-sm"><Link className="text-blue-600" to={"/manager/users/create"}>Create User</Link></div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Invoices</h3>
          <div className="text-sm text-blue-600"><Link to={'/manager/invoices'}>View more</Link></div>
        </div>
        <div className="space-y-3 mb-4">
          {invoices.slice(0,5).map(inv => (
            <div key={inv._id} className="border p-3 rounded">
              <div className="font-semibold">Invoice #{inv.number} - {inv.type}</div>
              <div className="text-sm text-gray-500">Status: {inv.status}</div>
            </div>
          ))}
        </div>
        <div className="text-sm"><Link className="text-blue-600" to={'/manager/invoices/create'}>Create Invoice</Link></div>
      </div>

      {loading && <p>Loading...</p>}
      <div className="space-y-4">
        {companies.map((c) => (
          <div key={c._id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-sm text-gray-600">Status: {c.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
