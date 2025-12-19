import React, { useEffect, useState } from 'react';
import { getUsers } from '../../serviceWorkers/managerServices';
import { Link } from 'react-router-dom';

export default function UsersPage(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);
  const load = async ()=>{
    setLoading(true);
    try{ const res = await getUsers(); setUsers(res.users || []); }catch(e){ console.error(e); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link className="text-sm text-blue-600" to={"/manager/users/create"}>Create User</Link>
      </div>
      {loading && <p>Loading...</p>}
      <div className="space-y-3">
        {users.map(u => (
          <div key={u._id} className="border p-3 rounded">
            <div className="font-semibold">{u.name} <span className="text-sm text-gray-500">({u.email})</span></div>
            <div className="text-sm text-gray-500">Company: {u.company?.name}</div>
            <div className="text-sm text-gray-500">BU: {u.company?.businessUnit?.name || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}