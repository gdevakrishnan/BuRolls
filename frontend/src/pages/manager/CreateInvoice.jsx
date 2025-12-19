import React, { useEffect, useState } from 'react';
import { createInvoice } from '../../serviceWorkers/managerServices';
import { getManagerCompanies, getAssignedBusinessUnits } from '../../serviceWorkers/managerServices';

export default function CreateInvoice(){
  const [type, setType] = useState('NORMAL');
  const [companies, setCompanies] = useState([]);
  const [bus, setBus] = useState([]);
  const [formItems, setFormItems] = useState([{ customerName:'', billingAddress:'', billingDate:'', paymentCode:'', amount:0 }]);
  const [companyId, setCompanyId] = useState('');
  const [businessUnitId, setBusinessUnitId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    getManagerCompanies().then((r)=> setCompanies(r.companies || [])).catch(console.error);
    getAssignedBusinessUnits().then((r)=> setBus(r.businessUnits || [])).catch(console.error);
  },[]);

  const addItem = ()=> setFormItems([...formItems, { customerName:'', billingAddress:'', billingDate:'', paymentCode:'', amount:0 }]);
  const removeItem = (idx)=> setFormItems(formItems.filter((_,i)=>i!==idx));
  const updateItem = (idx, field, val)=> setFormItems(formItems.map((it,i)=> i===idx? {...it, [field]: val}: it));

  const submit = async ()=>{
    if (type === 'NORMAL' && !companyId) return alert('Select company');
    if (type === 'CARRY' && !businessUnitId) return alert('Select business unit');
    if (!Array.isArray(formItems) || formItems.length === 0) return alert('Add items');
    setLoading(true);
    try{
      const payload = { type, items: formItems, companyId: type==='NORMAL'? companyId: undefined, businessUnitId: type==='CARRY'? businessUnitId: undefined };
      const res = await createInvoice(payload);
      if (res?.invoice) { alert('Invoice created'); setFormItems([{ customerName:'', billingAddress:'', billingDate:'', paymentCode:'', amount:0 }]); }
      else alert('Failed');
    }catch(e){ console.error(e); alert('Failed'); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <div className="max-w-3xl border p-4 rounded">
        <label className="mb-2 block">Type</label>
        <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full p-2 border mb-4">
          <option value="NORMAL">Normal Invoice</option>
          <option value="CARRY">Carry Invoice</option>
        </select>

        {type === 'NORMAL' && (
          <select value={companyId} onChange={(e)=>setCompanyId(e.target.value)} className="w-full p-2 border mb-4">
            <option value="">Select Company</option>
            {companies.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        )}

        {type === 'CARRY' && (
          <select value={businessUnitId} onChange={(e)=>setBusinessUnitId(e.target.value)} className="w-full p-2 border mb-4">
            <option value="">Select Business Unit</option>
            {bus.map(b=> <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        )}

        <div className="mb-4">
          <div className="font-semibold mb-2">Items</div>
          {formItems.map((it, idx)=> (
            <div key={idx} className="border p-3 mb-2 rounded">
              <input placeholder="Customer name" className="w-full mb-2 p-2 border" value={it.customerName} onChange={(e)=>updateItem(idx,'customerName', e.target.value)} />
              <input placeholder="Billing address" className="w-full mb-2 p-2 border" value={it.billingAddress} onChange={(e)=>updateItem(idx,'billingAddress', e.target.value)} />
              <input placeholder="Billing date" type="date" className="w-full mb-2 p-2 border" value={it.billingDate? it.billingDate.split('T')[0]: ''} onChange={(e)=>updateItem(idx,'billingDate', e.target.value)} />
              <input placeholder="Payment code" className="w-full mb-2 p-2 border" value={it.paymentCode} onChange={(e)=>updateItem(idx,'paymentCode', e.target.value)} />
              <input placeholder="Amount" type="number" className="w-full mb-2 p-2 border" value={it.amount} onChange={(e)=>updateItem(idx,'amount', Number(e.target.value))} />
              <div className="text-right"><button className="text-sm text-red-600" onClick={()=>removeItem(idx)}>Remove</button></div>
            </div>
          ))}
          <div><button className="px-3 py-1 bg-sky-600 text-white rounded" onClick={addItem}>Add item</button></div>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={submit} disabled={loading}>{loading? 'Creating...':'Create Invoice'}</button>
        </div>
      </div>
    </div>
  );
}