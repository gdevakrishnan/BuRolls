import React, { useEffect, useState } from 'react';
import { getCompanyInvoices, acceptInvoice, payInvoice } from '../../serviceWorkers/companyServices';
import AppContext from '../../context/AppContext';
import { useContext } from 'react';

export default function CompanyInvoicesPage(){
  const { user } = useContext(AppContext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if(user?.company) load(); }, [user]);
  const load = async ()=>{
    setLoading(true);
    try{
      const companyId = user.company?._id || user.company;
      const res = await getCompanyInvoices(companyId);
      setInvoices(res.invoices || []);
    }catch(e){ console.error(e);} setLoading(false);
  }

  const accept = async (id)=>{ const companyId = user.company?._id || user.company; const res = await acceptInvoice(companyId, id); if(res?.invoice){ alert('Accepted'); load(); } else alert('Failed'); }
  const pay = async (id)=>{ const companyId = user.company?._id || user.company; const info = { method: 'offline' }; const res = await payInvoice(companyId, id, info); if(res?.invoice){ alert('Paid'); load(); } else alert('Failed'); }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Company Invoices</h1>
      {loading && <p>Loading...</p>}
      <div className="space-y-3">
        {invoices.map(inv => (
          <div key={inv._id} className="border p-3 rounded">
            <div className="font-semibold">Invoice #{inv.number} - {inv.type}</div>
            <div className="text-sm text-gray-500">Status: {inv.status}</div>
            <div className="text-sm text-gray-500">Amount: {inv.totalAmount}</div>
            <div className="flex gap-2 mt-2">
              {inv.perCompanyStatus?.map(p => (String(p.company) === String(user.company?._id || user.company) ? (
                <React.Fragment key={String(p.company)}>
                  {p.status === 'PENDING' && <button className="px-2 py-1 bg-emerald-600 text-white rounded" onClick={()=>accept(inv._id)}>Accept</button>}
                  {p.status === 'ACCEPTED' && <button className="px-2 py-1 bg-sky-600 text-white rounded" onClick={()=>pay(inv._id)}>Pay</button>}
                </React.Fragment>
              ): null))}            </div>
          </div>
        ))}
      </div>
    </div>
  );
}