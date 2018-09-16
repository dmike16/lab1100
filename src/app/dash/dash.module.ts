import { NgModule } from '@angular/core';
import { DashComponent } from './dash.component';
import { DashRoutingModule } from './dash-routing.module';

@NgModule({
    imports: [DashRoutingModule],
    declarations: [DashComponent]
})
export class DashModule { }
