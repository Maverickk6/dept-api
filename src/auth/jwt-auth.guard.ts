import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const canActivateResult = super.canActivate(context);
    if (canActivateResult instanceof Observable) {
      return canActivateResult
        .pipe(
          map((value) => (value !== undefined ? value : false)),
          catchError(() => of(false)),
        )
        .toPromise() as Promise<boolean>;
    }
    return canActivateResult;
  }
}
