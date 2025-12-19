import React, { useEffect, useState } from 'react';
import { getUsers } from '../../serviceWorkers/adminServices';

export default function UsersPage(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(()=>{
    load();
  }, [page]);

  const load = async () => {
    setLoading(true);
    try{
      const res = await getUsers({ limit: 20, page });
      setUsers(res.users || []);
      setTotal(res.total || 0);
    }catch(e){ console.error(e) }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {loading && <p>Loading...</p>}
      <div className="space-y-2">
        {users.map(u => (
          <div key={u._id} className="border p-3 rounded">
            <div className="font-semibold">{u.name} <span className="text-sm text-gray-500">({u.email})</span></div>
            <div className="text-sm text-gray-500">BU: {u.company?.businessUnit?.name || '—'}</div>
            <div className="text-sm text-gray-500">Manager: {u.managers?.map(m=>m.name).join(', ') || '—'}</div>
            <div className="text-sm text-gray-400">Status: {u.status}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">Total: {total}</div>
        <div className="space-x-2">
          <button disabled={page<=1} onClick={()=>setPage(page-1)} className="px-3 py-1 border rounded">Prev</button>
          <button onClick={()=>setPage(page+1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}