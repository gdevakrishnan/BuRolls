import React, { useEffect, useState } from 'react';
import { getManagerCompanies, createCompany, createCompanyUser } from '../../serviceWorkers/managerServices';

export default function ManagerDashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', businessUnit: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', companyId: '' });
  const [assignedBus, setAssignedBus] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setLoading(true);
    getManagerCompanies()
      .then((res) => setCompanies(res.companies || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    // load assigned business units and stats
    import('../../serviceWorkers/managerServices').then(({ getAssignedBusinessUnits, getStats }) => {
      getAssignedBusinessUnits().then((r)=> setAssignedBus(r.businessUnits || [])).catch(()=>{});
      getStats().then((s)=> setStats(s || {})).catch(()=>{});
    });
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.businessUnit) return alert('name and businessUnit required');
    await createCompany(form);
    setForm({ name: '', businessUnit: '' });
    // reload
    setLoading(true);
    getManagerCompanies().then((res) => setCompanies(res.companies || [])).finally(()=>setLoading(false));
  }

  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.companyId) return alert('name email company required');
    const res = await createCompanyUser(userForm.companyId, { name: userForm.name, email: userForm.email });
    if (res?.user) { alert('User created'); setUserForm({ name: '', email: '', companyId: '' }); }
    else alert('Failed');
  }

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

      <div className="mb-6 border p-4 rounded max-w-md">
        <h3 className="font-semibold mb-2">Create Company</h3>
        <input placeholder="Company name" className="w-full mb-2 p-2 border" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
        <select className="w-full mb-2 p-2 border" value={form.businessUnit} onChange={(e)=>setForm({...form, businessUnit: e.target.value})}>
          <option value="">Select Business Unit</option>
          {assignedBus.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={handleCreate}>Create Company</button>
      </div>

      <div className="mb-6 border p-4 rounded max-w-md">
        <h3 className="font-semibold mb-2">Create User</h3>
        <input placeholder="User name" className="w-full mb-2 p-2 border" value={userForm.name} onChange={(e)=>setUserForm({...userForm, name: e.target.value})} />
        <input placeholder="User email" className="w-full mb-2 p-2 border" value={userForm.email} onChange={(e)=>setUserForm({...userForm, email: e.target.value})} />
        <select className="w-full mb-2 p-2 border" value={userForm.companyId} onChange={(e)=>setUserForm({...userForm, companyId: e.target.value})}>
          <option value="">Select Company</option>
          {companies.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={handleCreateUser}>Create User</button>
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
