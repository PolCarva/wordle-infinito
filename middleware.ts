import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const user = request.cookies.get('user');
    
    // Si el usuario está autenticado y trata de acceder a /auth, redirigir al juego
    if (user && request.nextUrl.pathname === '/auth') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Por ahora, permitimos el acceso a todas las demás rutas
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 