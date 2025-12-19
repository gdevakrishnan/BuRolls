import React, { useEffect, useState } from 'react';
import { createCompany } from '../../serviceWorkers/managerServices';
import { getAssignedBusinessUnits } from '../../serviceWorkers/managerServices';

export default function CreateCompany(){
  const [form, setForm] = useState({ name: '', businessUnit: '' });
  const [bus, setBus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ getAssignedBusinessUnits().then((r)=> setBus(r.businessUnits || [])).catch(console.error); }, []);

  const submit = async ()=>{
    if(!form.name || !form.businessUnit) return alert('name and businessUnit required');
    setLoading(true);
    try{
      const res = await createCompany(form);
      if(res?.company){ alert('Company created'); setForm({ name: '', businessUnit: '' }); }
      else alert('Failed');
    }catch(e){ console.error(e); alert('Failed'); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Company</h1>
      <div className="max-w-md border p-4 rounded">
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full mb-2 p-2 border" />
        <select value={form.businessUnit} onChange={(e)=>setForm({...form, businessUnit: e.target.value})} className="w-full mb-2 p-2 border">
          <option value="">Select Business Unit</option>
          {bus.map(b=> <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={submit} disabled={loading}>{loading? 'Creating...':'Create'}</button>
      </div>
    </div>
  );
}