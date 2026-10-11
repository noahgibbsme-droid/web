import { NextRequest,NextResponse } from 'next/server';
import { signSession } from '../../../lib/auth';
export async function POST(req:NextRequest){
 try{const {username,password}=await req.json();if(!process.env.ADMIN_USERNAME||!process.env.ADMIN_PASSWORD||username!==process.env.ADMIN_USERNAME||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:'Invalid login'}, {status:401});
 const res=NextResponse.json({ok:true});res.cookies.set('ng_admin_session',signSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*12});return res;
 }catch{return NextResponse.json({error:'Invalid request'},{status:400})}
}
