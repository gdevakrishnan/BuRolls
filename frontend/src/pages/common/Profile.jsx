import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { changePassword } from '../../serviceWorkers/authServices';
import { getAssignedBusinessUnits } from '../../serviceWorkers/managerServices';
import { updateBusinessUnit } from '../../serviceWorkers/businessUnitServices';

export default function Profile(){
  const { user } = useContext(AppContext);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [assignedBus, setAssignedBus] = useState([]);
  const [editingBu, setEditingBu] = useState(null);
  const [buForm, setBuForm] = useState({});

  useEffect(()=>{
    if (user?.role === 'BU_MANAGER'){
      getAssignedBusinessUnits().then((r)=> setAssignedBus(r.businessUnits || [])).catch(console.error);
    }
  }, [user]);

  const handleChange = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) return alert('All fields required');
    if (form.newPassword !== form.confirmPassword) return alert('New password and confirm password do not match');

    const payload = { oldPassword: form.currentPassword, newPassword: form.newPassword };
    const res = await changePassword(payload);
    if (res?.status === 200) alert('Password changed');
    else alert(res.message || 'Failed');
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  const startEdit = (bu) => {
    setEditingBu(bu);
    setBuForm({});
  }

  const submitBu = async () => {
    if (!editingBu) return;
    // only submit fields that are allowed and present in buForm
    const payload = {};
    (editingBu.allowedFields || []).forEach((f)=>{
      if (buForm[f] !== undefined) payload[f] = buForm[f];
    });
    if (Object.keys(payload).length === 0) return alert('No changes to save');
    try{
      const res = await updateBusinessUnit(editingBu._id, payload);
      if (res?.bu) { alert('Business unit updated');
        // refresh assigned BUs
        getAssignedBusinessUnits().then((r)=> setAssignedBus(r.businessUnits || [])).catch(console.error);
        setEditingBu(null);
      } else alert('Failed');
    }catch(e){ console.error(e); alert('Failed'); }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="border p-4 rounded max-w-md mb-6">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <hr className="my-4" />
        <h3 className="font-semibold mb-2">Change Password</h3>
        <input className="w-full mb-2 p-2 border" placeholder="Current password" type="password" value={form.currentPassword} onChange={(e)=>setForm({...form, currentPassword: e.target.value})} />
        <input className="w-full mb-2 p-2 border" placeholder="New password" type="password" value={form.newPassword} onChange={(e)=>setForm({...form, newPassword: e.target.value})} />
        <input className="w-full mb-2 p-2 border" placeholder="Confirm new password" type="password" value={form.confirmPassword} onChange={(e)=>setForm({...form, confirmPassword: e.target.value})} />
        <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={handleChange}>Change Password</button>
      </div>

      {user?.role === 'BU_MANAGER' && (
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Assigned Business Units</h3>
          {(assignedBus || []).map(b => (
            <div key={b._id} className="mb-4 border p-3 rounded">
              <div className="font-semibold">{b.name}</div>
              <div className="text-sm text-gray-600">Company Legal: {b.companyLegalName}</div>
              <div className="text-sm text-gray-600">Address: {b.companyAddress}</div>
              <div className="text-sm text-gray-600">Phone: {b.contactPhone}</div>
              { (b.allowedFields || []).length > 0 && (
                <div className="mt-2">
                  <button className="text-sm text-blue-600" onClick={()=>startEdit(b)}>Edit Business Unit</button>
                </div>
              )}
            </div>
          ))}

          {editingBu && (
            <div className="mt-4 border-t pt-3">
              <h4 className="font-semibold">Edit: {editingBu.name}</h4>
              {(editingBu.allowedFields || []).map(f => (
                <div key={f} className="mb-2">
                  <label className="text-sm block mb-1">{f}</label>
                  <input className="w-full p-2 border" defaultValue={editingBu[f] || ''} onChange={(e)=>setBuForm({...buForm, [f]: e.target.value})} />
                </div>
              ))}
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={submitBu}>Save</button>
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>setEditingBu(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}