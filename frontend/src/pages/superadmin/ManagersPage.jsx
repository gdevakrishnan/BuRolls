import React, { useState, useEffect } from 'react';
import { createManager } from '../../serviceWorkers/userServices';
import { getBusinessUnits } from '../../serviceWorkers/businessUnitServices';

export default function ManagersPage(){
  const [form, setForm] = useState({ name: '', email: '', businessUnits: [] });
  const [bus, setBus] = useState([]);

  useEffect(()=>{
    getBusinessUnits().then((res)=> setBus(res.businessUnits || [])).catch(console.error);
  },[]);

  const submit = async () => {
    if(!form.name || !form.email) return alert('name and email required');
    const payload = { name: form.name, email: form.email, businessUnits: form.businessUnits };
    const res = await createManager(payload);
    if (res?.manager) { alert('Manager created'); setForm({ name: '', email: '', businessUnits: [] }); }
    else alert('Failed');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Managers</h1>
      <div className="max-w-md border p-4 rounded">
        <input className="w-full mb-2 p-2 border" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        <input className="w-full mb-2 p-2 border" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />

        <label className="text-sm mb-1">Assign Business Units</label>
        <select multiple className="w-full mb-2 p-2 border" value={form.businessUnits} onChange={(e)=>{
          const vals = Array.from(e.target.selectedOptions).map(o=>o.value);
          setForm({...form, businessUnits: vals});
        }}>
          {bus.map(b=> <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>

        <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={submit}>Create Manager</button>
      </div>
    </div>
  );
}