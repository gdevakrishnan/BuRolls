import React, { useEffect, useState, useContext } from 'react';
import { getBusinessUnits, createBusinessUnit, updateBusinessUnit, assignManager } from '../../serviceWorkers/businessUnitServices';
import AppContext from '../../context/AppContext';

export default function BusinessUnitsPage(){
  const { user } = useContext(AppContext);
  const [bus, setBus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', companyLegalName: '', companyAddress: '', contactPhone: '' });
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    getBusinessUnits().then((res) => setBus(res.businessUnits || [])).catch(console.error).finally(()=>setLoading(false));
  }

  useEffect(()=>{ load(); }, []);

  const handleCreate = async () => {
    await createBusinessUnit(form);
    setForm({ name: '', companyLegalName: '', companyAddress: '', contactPhone: '' });
    load();
  }

  const handleUpdate = async (id) => {
    await updateBusinessUnit(id, form);
    setEditing(null);
    setForm({ name: '', companyLegalName: '', companyAddress: '', contactPhone: '' });
    load();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Business Units</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{editing? 'Edit BU':'Create BU'}</h3>
            <input className="w-full mb-2 p-2 border" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
            <input className="w-full mb-2 p-2 border" placeholder="Legal Name" value={form.companyLegalName} onChange={(e)=>setForm({...form, companyLegalName: e.target.value})} />
            <input className="w-full mb-2 p-2 border" placeholder="Address" value={form.companyAddress} onChange={(e)=>setForm({...form, companyAddress: e.target.value})} />
            <input className="w-full mb-2 p-2 border" placeholder="Phone" value={form.contactPhone} onChange={(e)=>setForm({...form, contactPhone: e.target.value})} />
            {editing ? (
              <div className="flex gap-2">
                <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={()=>handleUpdate(editing)}>Save</button>
                <button className="px-3 py-1 rounded border" onClick={()=>{setEditing(null); setForm({ name: '', companyLegalName: '', companyAddress: '', contactPhone: '' })}}>Cancel</button>
              </div>
            ) : (
              user?.role === 'SUPER_ADMIN' && <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={handleCreate}>Create</button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-3">
            {loading && <p>Loading...</p>}
            {bus.map((b)=> (
              <div key={b._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{b.name}</h3>
                  <p className="text-sm text-gray-600">Legal: {b.companyLegalName || '-'}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded" onClick={()=>{ setEditing(b._id); setForm({ name: b.name, companyLegalName:b.companyLegalName||'', companyAddress:b.companyAddress||'', contactPhone:b.contactPhone||'' })}}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}