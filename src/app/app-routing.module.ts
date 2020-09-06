import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'airplane',
    pathMatch: 'full'
  },
  {
    path: 'airplane',
    loadChildren: () => import('./airplane/airplane.module').then( m => m.AirplanePageModule)
  },
  {
    path: 'call-sign',
    loadChildren: () => import('./call-sign/call-sign.module').then( m => m.CallSignPageModule)
  },
  {
    path: 'go',
    loadChildren: () => import('./go/go.module').then( m => m.GoPageModule)
  },
  {
    path: 'operating',
    loadChildren: () => import('./operating/operating.module').then( m => m.OperatingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
