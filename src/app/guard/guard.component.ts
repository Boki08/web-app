import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor() {}

  canActivate() {
    return localStorage.role != 'Admin';
  }
}