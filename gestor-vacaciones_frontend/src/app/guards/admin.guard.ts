import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn:'root'
})
class PermissionsToken {
  constructor(
    private router:Router 
    ){

  }
  canActivate(): boolean {
    let tipo = JSON.parse(atob(localStorage.getItem('tipo')!));
    if(tipo && tipo === 'Administrador'){
      return true;
    }
    else{
      this.router.navigate(['/pagenotfound'])
    return false;
  }
}
}



export const adminGuard: CanActivateFn = (route:  ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsToken).canActivate();
};
