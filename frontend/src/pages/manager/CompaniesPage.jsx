import React, { useEffect, useState } from 'react';
import { getManagerCompanies } from '../../serviceWorkers/managerServices';
import { Link } from 'react-router-dom';

export default function CompaniesPage(){
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);
  const load = async ()=>{
    setLoading(true);
    try{ const res = await getManagerCompanies(); setCompanies(res.companies || []); }catch(e){ console.error(e); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Link className="text-sm text-blue-600" to={"/manager/companies/create"}>Create Company</Link>
      </div>
      {loading && <p>Loading...</p>}
      <div className="space-y-3">
        {companies.map(c => (
          <div key={c._id} className="border p-3 rounded">
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-gray-500">Status: {c.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}