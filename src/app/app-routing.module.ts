import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
    {
        path: 'dash',
        loadChildren: './dash/dash.module#DashModule'
    },
    {
        path: '**',
        component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
