import React, { useEffect, useState } from 'react';
import { getInvoice, adminUpdateInvoice } from '../../serviceWorkers/adminServices';
import { useParams } from 'react-router-dom';

export default function InvoiceDetail(){
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);
  const load = async ()=>{ setLoading(true); try{ const res = await getInvoice(invoiceId); setInvoice(res.invoice || res); }catch(e){ console.error(e); } setLoading(false); };

  const [editing, setEditing] = useState(false);
  const [editableItems, setEditableItems] = useState([]);

  const approve = async ()=>{
    const res = await adminUpdateInvoice(invoiceId, { action: 'approve' });
    if(res?.invoice){ alert('Approved'); load(); } else alert('Failed');
  }

  const reject = async ()=>{
    const note = prompt('Reason');
    if(!note) return;
    const res = await adminUpdateInvoice(invoiceId, { action: 'reject', note });
    if(res?.invoice){ alert('Rejected'); load(); } else alert('Failed');
  }

  const startEdit = ()=>{
    setEditableItems((invoice.items || []).map(it => ({ ...it })));
    setEditing(true);
  }

  const updateItem = (idx, field, val) => {
    setEditableItems(items => items.map((it,i)=> i===idx? {...it, [field]: val}: it));
  }

  const saveEdits = async ()=>{
    const items = editableItems.map(it=> ({ customerName: it.customerName, billingAddress: it.billingAddress, billingDate: it.billingDate, paymentCode: it.paymentCode, amount: Number(it.amount) }));
    const totalCustomers = items.length;
    const totalAmount = items.reduce((s,i)=> s + (Number(i.amount)||0), 0);
    const res = await adminUpdateInvoice(invoiceId, { action: 'edit', updatedFields: { items, totalCustomers, totalAmount } });
    if (res?.invoice){ alert('Saved'); setEditing(false); load(); } else alert('Failed');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoice Detail</h1>
      {loading && <p>Loading...</p>}
      {invoice && (
        <div className="border p-4 rounded">
          <div className="font-semibold mb-2">Invoice #{invoice.number}</div>
          <div className="text-sm text-gray-500 mb-2">Type: {invoice.type}</div>
          <div className="text-sm text-gray-500 mb-2">Status: {invoice.status}</div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Items</div>
              {!editing && <div>
                <button className="mr-2 px-2 py-1 bg-sky-600 text-white rounded" onClick={startEdit}>Edit</button>
              </div>}
            </div>

            {editing ? (
              <div>
                {editableItems.map((it, idx)=> (
                  <div key={idx} className="border p-2 rounded my-2">
                    <input className="w-full mb-1 p-1 border" value={it.customerName || ''} onChange={(e)=>updateItem(idx,'customerName', e.target.value)} placeholder="Customer name" />
                    <input className="w-full mb-1 p-1 border" value={it.billingAddress || ''} onChange={(e)=>updateItem(idx,'billingAddress', e.target.value)} placeholder="Billing address" />
                    <input type="date" className="w-full mb-1 p-1 border" value={it.billingDate? (it.billingDate.split && it.billingDate.split('T')[0]) : (it.billingDate|| '')} onChange={(e)=>updateItem(idx,'billingDate', e.target.value)} />
                    <input className="w-full mb-1 p-1 border" value={it.paymentCode || ''} onChange={(e)=>updateItem(idx,'paymentCode', e.target.value)} placeholder="Payment code" />
                    <input className="w-full mb-1 p-1 border" type="number" value={it.amount || 0} onChange={(e)=>updateItem(idx,'amount', e.target.value)} placeholder="Amount" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={saveEdits}>Save</button>
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                {invoice.items.map((it, idx)=> (
                  <div key={idx} className="border p-2 rounded my-2">
                    <div>{it.customerName} - {it.amount}</div>
                    <div className="text-sm text-gray-500">Billing: {it.billingAddress}</div>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={approve}>Approve</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={reject}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}