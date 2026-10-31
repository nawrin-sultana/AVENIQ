import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
const row=z.object({id:z.string().min(1),name:z.string().min(1),segment:z.enum(['Enterprise','Mid-Market','SMB']),arr:z.coerce.number().nonnegative(),renewalDays:z.coerce.number().int().nonnegative()});
export async function POST(req:NextRequest){
 const raw=await req.text();if(raw.length>2_000_000)return NextResponse.json({error:'File too large (2MB maximum)'},{status:413});
 const lines=raw.trim().split(/\r?\n/);const headers=(lines.shift()||'').split(',').map(h=>h.trim());const required=['id','name','segment','arr','renewalDays'];const missing=required.filter(h=>!headers.includes(h));if(missing.length)return NextResponse.json({valid:false,errors:[`Missing columns: ${missing.join(', ')}`]},{status:400});
 const errors:string[]=[];const parsed=[];
 for(let i=0;i<lines.length;i++){const cells=lines[i].split(',');if(cells.length!==headers.length){errors.push(`Row ${i+2}: column count mismatch`);continue;}const candidate=Object.fromEntries(headers.map((h,j)=>[h,cells[j].trim()]));const checked=row.safeParse(candidate);if(!checked.success)errors.push(`Row ${i+2}: ${checked.error.issues.map(e=>e.path+': '+e.message).join('; ')}`);else parsed.push(checked.data);if(errors.length>25)break;}
 return NextResponse.json({valid:errors.length===0,rows:parsed.length,errors,note:'Validation-only MVP: records are not persisted or merged into the demo database.'},{status:errors.length?400:200});
}
