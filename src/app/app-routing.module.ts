import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';
import { ResearchComponent } from './research/research.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },

  {
    path: 'dashboard', component: DashboardComponent
  },

  {
    path: 'contact', component: ContactComponent
  },

  {
    path: 'research', component: ResearchComponent
  },

  {
    path: '**', component: ErrorComponent
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
