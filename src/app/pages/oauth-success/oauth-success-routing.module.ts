import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OauthSuccessComponent } from './oauth-success.component';

const routes: Routes = [{ path: '', component: OauthSuccessComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OauthSuccessRoutingModule { }