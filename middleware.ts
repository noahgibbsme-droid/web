import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
export function middleware(req:NextRequest){
 const host=(req.headers.get('host')||'').split(':')[0].toLowerCase();
 const adminHost=(process.env.ADMIN_DOMAIN||'').toLowerCase();
 const isAdminHost=!!adminHost && host===adminHost;
 const url=req.nextUrl.clone();
 if(isAdminHost && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/admin')){url.pathname='/admin'+(url.pathname==='/'?'':url.pathname);return NextResponse.rewrite(url)}
 const protectedRoute=url.pathname.startsWith('/admin') || (isAdminHost && url.pathname==='/');
 if(protectedRoute && url.pathname!=='/admin/login' && !url.pathname.startsWith('/api/login')){
  const token=req.cookies.get('ng_admin_session')?.value;
  const expected=createHmac('sha256',process.env.SESSION_SECRET||'development-only-change-me').update(`${process.env.ADMIN_USERNAME}:admin-session`).digest('hex');
  let valid=false;try{valid=!!token&&timingSafeEqual(Buffer.from(token),Buffer.from(expected))}catch{}
  if(!valid){url.pathname='/admin/login';return NextResponse.redirect(url)}
 }
 return NextResponse.next();
}
export const config={matcher:['/admin/:path*','/api/:path*','/:path*']};
