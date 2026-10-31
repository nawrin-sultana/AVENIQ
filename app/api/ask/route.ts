import {NextRequest,NextResponse} from 'next/server';
import {generateDatabase,summarize} from '@/lib/engine';
export async function POST(req:NextRequest){
 try{const body=await req.json();const q=String(body.question||'').slice(0,500);if(!q)return NextResponse.json({error:'Question required'},{status:400});
 const db=generateDatabase();const s=summarize(db);const low=q.toLowerCase();
 let answer='';let records:string[]=[];
 if(/churn|risk|at.risk|renewal/.test(low)){const ranked=db.accounts.filter(a=>a.status==='At Risk').sort((a,b)=>a.health-b.health).slice(0,5);records=ranked.map(a=>a.id);answer=`${s.atRisk} of ${s.accountCount} accounts are classified At Risk using deterministic signal scoring. Top accounts: ${ranked.map(a=>`${a.name} (${a.health}/100)`).join('; ')}. Revenue at risk is a scenario exposure estimate, not predicted churn.`;}
 else if(/expan|upsell|cross.sell|growth/.test(low)){const ranked=s.actions.filter(a=>a.kind==='Growth').slice(0,5);records=ranked.map(a=>a.accountId);answer=`${ranked.length} highlighted expansion actions include ${ranked.map(a=>a.accountId).join(', ')}. Expansion estimates assume 20% of each qualifying account's ARR, and do not represent committed revenue.`;}
 else if(/marketing|campaign|attribution/.test(low)){const best=[...db.campaigns].sort((a,b)=>b.influenced-a.influenced).slice(0,5);records=best.map(a=>a.id);answer=`Top campaigns by synthetically modeled influenced pipeline: ${best.map(c=>`${c.name} ($${Math.round(c.influenced/1000)}k)`).join('; ')}. Influenced values are illustrative and may overlap; do not add them as unique generated revenue.`;}
 else if(/pipeline|deal|stalled/.test(low)){const stalled=db.opportunities.filter(o=>o.probability>0&&o.probability<1&&(o.daysInactive>30||!o.nextStep));records=stalled.slice(0,5).map(o=>o.id);answer=`There are ${stalled.length} open opportunities with inactivity exceeding 30 days or missing next steps. Weighted open pipeline is $${Math.round(s.pipeline).toLocaleString()}. Prioritize these deals for owner follow-up.`;}
 else {records=s.actions.slice(0,5).map(a=>a.accountId);answer=`AVENIQ monitors ${s.accountCount} accounts and $${Math.round(s.arr).toLocaleString()} in synthetic ARR. ${s.atRisk} accounts are at risk and ${s.actions.length} rule-based actions have been identified. Try asking about churn, stalled deals, expansion, or campaigns.`;}
 return NextResponse.json({answer,records,mode:'Grounded rule-based demo; no LLM used',sources:'Synthetic CRM dataset'});
 }catch{return NextResponse.json({error:'Invalid request'},{status:400})}
}
