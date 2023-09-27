import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn:'root'
})
class PermissionsToken {
  constructor(
    private router: Router,
    ){

  }
  canActivate(): boolean {
    const tipo = JSON.parse(atob(localStorage.getItem('tipo')!));

    if(tipo && tipo === 'Trabajador'){
      return true;
    }
    else{
      this.router.navigate(['/pagenotfound'])
    return false;
  }
}
}


export const trabajadorGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsToken).canActivate();

};
