import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class RoleGuard implements CanActivate {
  private rolePassed: string;
  constructor(role: string) {
    this.rolePassed = role;
  }
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const req: any = ctx.getRequest<Request>();
    return this.rolePassed === req.user.role;
  }
}
