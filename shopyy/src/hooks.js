import * as cookie from 'cookie'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  event.locals.user = cookies.user;
  return resolve(event);
  }
  
/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
    return{
          user: request.locals.user    
          }
  }
