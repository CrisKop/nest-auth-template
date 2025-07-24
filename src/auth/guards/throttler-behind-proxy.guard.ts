import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Si estás detrás de un proxy (como nginx), usa el header X-Forwarded-For
    return req.ips.length ? req.ips[0] : req.ip;
  }

  protected generateKey(context: ExecutionContext, suffix: string, name: string): string {
    // Genera una clave única para el rate limiting
    const tracker = this.getTracker(context.switchToHttp().getRequest());
    return `${tracker}-${context.getHandler().name}-${name}-${suffix}`;
  }
}