import React, { useState, useEffect } from 'react';
import { createManager } from '../../serviceWorkers/userServices';
import { getBusinessUnits } from '../../serviceWorkers/businessUnitServices';
import { assignManager } from '../../serviceWorkers/businessUnitServices';

const ALLOWED_FIELDS = ["name","companyLegalName","companyAddress","contactPhone"];

export default function ManagersPage(){
  const [form, setForm] = useState({ name: '', email: '', businessUnits: [] });
  const [bus, setBus] = useState([]);

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    getBusinessUnits().then((res)=> setBus(res.businessUnits || [])).catch(console.error);
    loadManagers();
  },[]);

  const loadManagers = async () => {
    setLoading(true);
    try{
      const res = await import('../../serviceWorkers/adminServices').then(m=> m.getManagers({ limit: 100 }));
      setManagers(res.managers || []);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  const submit = async () => {
    if(!form.name || !form.email) return alert('name and email required');
    const payload = { name: form.name, email: form.email, businessUnits: form.businessUnits };
    const res = await createManager(payload);
    if (res?.manager) { alert('Manager created'); setForm({ name: '', email: '', businessUnits: [] }); loadManagers(); }
    else alert('Failed');
  }

  const [editingManager, setEditingManager] = useState(null);
  const [permissionState, setPermissionState] = useState({});

  const openEdit = (m) => {
    setEditingManager(m);
    const state = {};
    (m.businessUnits || []).forEach((b) => {
      const perm = (m.businessUnitPermissions || []).find(p => String(p.businessUnit) === String(b._id));
      state[b._id] = { fields: perm ? perm.fields.slice() : [] };
    });
    setPermissionState(state);
  }

  const toggleField = (buId, field) => {
    setPermissionState((s)=>{
      const prev = s[buId] || { fields: [] };
      const has = prev.fields.includes(field);
      return { ...s, [buId]: { fields: has ? prev.fields.filter(f=>f!==field) : [...prev.fields, field] } };
    });
  }

  const savePermissions = async (buId) => {
    const fields = permissionState[buId]?.fields || [];
    const res = await assignManager(buId, { managerId: editingManager._id, fields });
    if (res?.msg) {
      alert('Permissions updated');
      loadManagers();
    } else alert('Failed');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Managers</h1>
      <div className="max-w-md border p-4 rounded mb-6">
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

      <div>
        <h2 className="text-lg font-semibold mb-2">Existing Managers</h2>
        {loading && <p>Loading...</p>}
        <div className="space-y-2">
          {managers.map(m => (
            <div key={m._id} className="border p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{m.name} <span className="text-sm text-gray-500">({m.email})</span></div>
                  <div className="text-sm text-gray-500">Status: {m.status}</div>
                  <div className="text-sm text-gray-500">Business Units: {m.businessUnits?.map(b=>b.name).join(', ')}</div>
                </div>
                <div>
                  <button className="text-sm text-blue-600" onClick={()=>openEdit(m)}>Edit Access</button>
                </div>
              </div>

              {editingManager && String(editingManager._id) === String(m._id) && (
                <div className="mt-3 border-t pt-3">
                  <div className="text-sm font-semibold mb-2">Edit Access</div>
                  {(m.businessUnits || []).map(b=> (
                    <div key={b._id} className="mb-2">
                      <div className="font-semibold">{b.name}</div>
                      <div className="flex gap-2 mt-1">
                        {ALLOWED_FIELDS.map(f => (
                          <label key={f} className="text-sm"><input type="checkbox" checked={(permissionState[b._id]?.fields||[]).includes(f)} onChange={()=>toggleField(b._id,f)} /> {f}</label>
                        ))}
                      </div>
                      <div className="mt-1"><button className="px-2 py-1 bg-sky-600 text-white rounded text-sm" onClick={()=>savePermissions(b._id)}>Save</button></div>
                    </div>
                  ))}
                  <div className="mt-2"><button className="text-sm text-red-600" onClick={()=>setEditingManager(null)}>Close</button></div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}