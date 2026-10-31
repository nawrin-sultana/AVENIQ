export type Segment = 'Enterprise'|'Mid-Market'|'SMB';
export type Account = {id:string;name:string;industry:string;segment:Segment;owner:string;arr:number;renewalDays:number;usageChange:number;engagement:number;supportOpen:number;supportCritical:number;paymentLate:boolean;stakeholderActive:boolean;csat:number;seatUtilization:number;growth:number;health:number;status:'Healthy'|'Watchlist'|'At Risk';signals:{label:string;points:number;source:string}[]};
export type Opportunity={id:string;accountId:string;name:string;amount:number;probability:number;stage:string;daysInactive:number;nextStep:boolean;createdDaysAgo:number};
export type Activity={id:string;accountId:string;type:string;daysAgo:number};
export type Case={id:string;accountId:string;priority:string;open:boolean};
export type Campaign={id:string;name:string;channel:string;spend:number;leads:number;opportunities:number;influenced:number;firstTouch:number;lastTouch:number};
export type Database={accounts:Account[];contacts:{id:string;accountId:string;name:string}[];opportunities:Opportunity[];activities:Activity[];cases:Case[];campaigns:Campaign[];subscriptions:{id:string;accountId:string;arr:number;seats:number;usedSeats:number}[];renewals:{id:string;accountId:string;daysUntil:number;arr:number}[]};
const industries=['Financial Services','SaaS & Technology','Manufacturing','Healthcare','Retail & Commerce','Media','Logistics'];
const prefixes=['Northstar','Atlas','Vertex','Meridian','Summit','Nexus','Ironwood','Bluebird','Apex','Pioneer','Horizon','Solstice','Cobalt','Aurora','Evergreen','Silverline','Pacific','Granite','Clearwater','Redwood'];
const suffixes=['Systems','Analytics','Labs','Commerce','Cloud','Group','Networks','Technologies','Digital','Solutions','Capital','Industries'];
const owners=['Alex Morgan','Jordan Lee','Taylor Chen','Sam Rivera','Avery Patel'];
function rng(seed=7291){let s=seed;return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}};
function round(v:number){return Math.round(v)}
export function healthScore(a:Pick<Account,'usageChange'|'engagement'|'supportCritical'|'paymentLate'|'stakeholderActive'|'csat'|'renewalDays'>){
 const signals=[
  {label:'Product adoption',points:Math.max(-25,Math.min(10,round(a.usageChange*0.8))),source:'product_usage.usage_change_pct'},
  {label:'Engagement',points:round((a.engagement-50)*0.25),source:'activities.engagement_index'},
  {label:'Support escalations',points:-a.supportCritical*12,source:'cases.priority'},
  {label:'Payment reliability',points:a.paymentLate?-10:0,source:'billing.days_overdue'},
  {label:'Stakeholder coverage',points:a.stakeholderActive?4:-9,source:'contacts.last_active'},
  {label:'Satisfaction',points:round((a.csat-3)*5),source:'customer_success.csat'},
  {label:'Renewal proximity',points:a.renewalDays<60?-8:0,source:'renewals.days_until'}
 ];
 const health=Math.max(0,Math.min(100,round(70+signals.reduce((n,s)=>n+s.points,0))));
 return {health,signals,status:health<50?'At Risk':health<75?'Watchlist':'Healthy'} as const;
}
export function generateDatabase():Database{
 const r=rng();const choice=<T,>(xs:T[])=>xs[Math.floor(r()*xs.length)];
 const accounts:Account[]=Array.from({length:500},(_,i)=>{
 const segment:Segment=i%8<2?'Enterprise':i%8<5?'Mid-Market':'SMB';
 const profile=i%9;const weak=profile===0||profile===1;
 const vals={usageChange:round((r()-.39)*45-(weak?20:0)),engagement:round(25+r()*75-(weak?22:0)),supportCritical:weak&&r()>.35?1+Math.floor(r()*2):r()>.93?1:0,paymentLate:weak&&r()>.62,stakeholderActive:r()>(weak?.65:.2),csat:round((2.2+r()*2.8-(weak?.8:0))*10)/10,renewalDays:round(12+r()*340)};
 const hs=healthScore(vals);
 return {id:`ACC-${String(i+1).padStart(4,'0')}`,name:`${prefixes[i%prefixes.length]} ${suffixes[Math.floor(i/prefixes.length)%suffixes.length]} ${i>239?String(Math.floor(i/240)+1):''}`.trim(),industry:choice(industries),segment,owner:choice(owners),arr:round((segment==='Enterprise'?180000:segment==='Mid-Market'?70000:15000)*(0.6+r()*1.3)),renewalDays:vals.renewalDays,usageChange:vals.usageChange,engagement:vals.engagement,supportOpen:round(r()*4)+(weak?2:0),supportCritical:vals.supportCritical,paymentLate:vals.paymentLate,stakeholderActive:vals.stakeholderActive,csat:vals.csat,seatUtilization:round(30+r()*68),growth:round((r()-.25)*40),health:hs.health,status:hs.status,signals:hs.signals};
 });
 const contacts=Array.from({length:1000},(_,i)=>({id:`CON-${i+1}`,accountId:accounts[Math.floor(i/2)].id,name:`Contact ${i+1}`}));
 const stages=['Discovery','Qualification','Proposal','Negotiation','Closed Won','Closed Lost'];
 const opportunities:Opportunity[]=Array.from({length:750},(_,i)=>{const a=accounts[Math.floor(r()*accounts.length)];const stage=choice(stages);return {id:`OPP-${i+1}`,accountId:a.id,name:`${a.name} — ${choice(['Platform Expansion','New Business','Annual Renewal','Data Suite'])}`,amount:round(a.arr*(.25+r()*1.0)),probability:({'Discovery':.15,'Qualification':.3,'Proposal':.55,'Negotiation':.8,'Closed Won':1,'Closed Lost':0} as Record<string,number>)[stage],stage,daysInactive:round(r()*90),nextStep:r()>.28,createdDaysAgo:round(r()*365)};});
 const activities:Activity[]=Array.from({length:2000},(_,i)=>({id:`ACT-${i+1}`,accountId:choice(accounts).id,type:choice(['Call','Email','Meeting','Demo']),daysAgo:round(r()*180)}));
 const cases:Case[]=Array.from({length:300},(_,i)=>({id:`CASE-${i+1}`,accountId:choice(accounts).id,priority:choice(['Low','Medium','High','Critical']),open:r()>.38}));
 const campaigns:Campaign[]=Array.from({length:100},(_,i)=>{const leads=round(50+r()*900);const opp=round(leads*(.02+r()*.12));return {id:`CAM-${i+1}`,name:`${choice(['ABM','Lifecycle','Webinar','Partner','Paid Search'])} — Q${(i%4)+1} ${2025+Math.floor(i/50)} / ${i+1}`,channel:choice(['Email','Events','Paid','Partners','Organic']),spend:round(4000+r()*40000),leads,opportunities:opp,influenced:round(opp*(15000+r()*95000)),firstTouch:round(opp*.4),lastTouch:round(opp*.35)};});
 const subscriptions=accounts.map(a=>({id:`SUB-${a.id}`,accountId:a.id,arr:a.arr,seats:round(40+r()*600),usedSeats:round(20+r()*40)}));
 const renewals=accounts.map(a=>({id:`REN-${a.id}`,accountId:a.id,daysUntil:a.renewalDays,arr:a.arr}));
 return {accounts,contacts,opportunities,activities,cases,campaigns,subscriptions,renewals};
}
export type Action={id:string;accountId:string;title:string;reason:string;impact:number;priority:'Critical'|'High'|'Medium';owner:string;source:string;success:string;kind:'Retention'|'Growth'|'Pipeline'};
export function actionsFor(db:Database,account:Account):Action[]{
 const out:Action[]=[];const base={accountId:account.id,owner:account.owner};
 if(account.health<75&&account.renewalDays<=120)out.push({...base,id:`RET-${account.id}`,title:'Schedule renewal recovery plan',reason:`Health ${account.health}/100; renewal in ${account.renewalDays} days`,impact:round(account.arr*(account.health<50?.65:.3)),priority:account.health<50?'Critical':'High',source:`${account.id}: health signals + renewal record`,success:'Renewal completed; health above 75',kind:'Retention'});
 if(account.supportCritical>0)out.push({...base,id:`SUP-${account.id}`,title:'Escalate customer support resolution',reason:`${account.supportCritical} critical case signal(s)`,impact:round(account.arr*.15),priority:'High',source:`${account.id}: support case summary`,success:'Critical escalations resolved',kind:'Retention'});
 if(account.seatUtilization>79&&account.usageChange>5&&account.health>=60)out.push({...base,id:`EXP-${account.id}`,title:'Explore additional seat capacity',reason:`${account.seatUtilization}% utilization; usage change +${account.usageChange}%`,impact:round(account.arr*.2),priority:'Medium',source:`${account.id}: subscription utilization + usage trend`,success:'Expansion opportunity qualified',kind:'Growth'});
 for(const op of db.opportunities.filter(o=>o.accountId===account.id&&o.probability>0&&o.probability<1&&((o.daysInactive>30)||!o.nextStep))){out.push({...base,id:`PIPE-${op.id}`,title:'Re-engage stalled opportunity',reason:`${op.stage}; ${op.daysInactive} inactive days; ${op.nextStep?'next step recorded':'no next step'}`,impact:round(op.amount*op.probability),priority:op.daysInactive>60?'High':'Medium',source:op.id,success:'Next meeting scheduled and CRM updated',kind:'Pipeline'});}
 return out;
}
export function summarize(db:Database,segment='All'){
 const accounts=segment==='All'?db.accounts:db.accounts.filter(a=>a.segment===segment);const ids=new Set(accounts.map(a=>a.id));const ops=db.opportunities.filter(o=>ids.has(o.accountId));const actions=accounts.flatMap(a=>actionsFor(db,a));
 const open=ops.filter(o=>o.probability>0&&o.probability<1);
 return {arr:accounts.reduce((s,a)=>s+a.arr,0),risk:accounts.filter(a=>a.status==='At Risk').reduce((s,a)=>s+a.arr*.65,0),expansion:actions.filter(a=>a.kind==='Growth').reduce((s,a)=>s+a.impact,0),pipeline:open.reduce((s,o)=>s+o.amount*o.probability,0),confidence:open.length?round(100-open.filter(o=>o.daysInactive>30||!o.nextStep).length/open.length*45):100,accountCount:accounts.length,healthy:accounts.filter(a=>a.status==='Healthy').length,watch:accounts.filter(a=>a.status==='Watchlist').length,atRisk:accounts.filter(a=>a.status==='At Risk').length,actions:actions.sort((a,b)=>b.impact-a.impact)};
}
export function simulate(db:Database,params:{churn:number;upsell:number;win:number;acv:number}){
 const s=summarize(db);const base=s.arr;const retained=s.risk*params.churn/100;const expansion=s.expansion*params.upsell/100;const newBusiness=s.pipeline*(params.win/100)*(1+params.acv/100);
 return {base,retained,expansion,newBusiness,projected:base+retained+expansion+newBusiness,assumptions:'Illustrative incremental uplift. Components are independent, not calibrated forecasts.'};
}
