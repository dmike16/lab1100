import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashComponent } from './dash.component';

const dashRoutes: Routes = [
    { path: '', component: DashComponent }
];

@NgModule({
    imports: [RouterModule.forChild(dashRoutes)],
    exports: [RouterModule]
})
export class DashRoutingModule { }
