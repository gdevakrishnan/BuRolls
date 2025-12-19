import React, { useEffect, useState } from 'react';
import { createCompanyUser, getManagerCompanies } from '../../serviceWorkers/managerServices';

export default function CreateUser(){
  const [form, setForm] = useState({ name:'', email:'', companyId: '' });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ getManagerCompanies().then((r)=> setCompanies(r.companies || [])).catch(console.error); }, []);

  const submit = async ()=>{
    if(!form.name || !form.email || !form.companyId) return alert('name email company required');
    setLoading(true);
    try{
      const res = await createCompanyUser(form.companyId, { name: form.name, email: form.email });
      if(res?.user){ alert('User created'); setForm({ name:'', email:'', companyId:'' }); }
      else alert('Failed');
    }catch(e){ console.error(e); alert('Failed'); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <div className="max-w-md border p-4 rounded">
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full mb-2 p-2 border" />
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full mb-2 p-2 border" />
        <select value={form.companyId} onChange={(e)=>setForm({...form, companyId: e.target.value})} className="w-full mb-2 p-2 border">
          <option value="">Select Company</option>
          {companies.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={submit} disabled={loading}>{loading? 'Creating...':'Create'}</button>
      </div>
    </div>
  );
}