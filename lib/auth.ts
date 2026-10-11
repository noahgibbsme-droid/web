import { createHmac, timingSafeEqual } from 'crypto';
export function signSession(){return createHmac('sha256', process.env.SESSION_SECRET || 'development-only-change-me').update(`${process.env.ADMIN_USERNAME}:admin-session`).digest('hex')}
export function isValidSession(value?:string|null){if(!value)return false;const expected=signSession();try{return timingSafeEqual(Buffer.from(value),Buffer.from(expected))}catch{return false}}
