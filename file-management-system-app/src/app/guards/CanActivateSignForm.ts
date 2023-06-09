import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class CanActivateSignForm implements CanActivate {
    constructor(router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot)
                : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> 
    {
        if (!sessionStorage.getItem("token") && !localStorage.getItem("token")) {
            return true;
        }

        return false;
    }
}