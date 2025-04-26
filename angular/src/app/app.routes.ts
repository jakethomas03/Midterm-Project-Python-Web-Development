import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MoviesComponent } from './movies/movies.component';
import { roleGuard } from './services/role.guard';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TodosComponent } from './todos/todos.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Todo App - Home',
  },
  {
    path: 'todos',
    component: TodosComponent,
    title: 'Todo App - Todos',
    canMatch: [roleGuard],
    data: {
      roles: ['BasicUser', 'AdminUser'],
    },
  },
  {
    path: 'movies',
    component: MoviesComponent,
    title: 'Todo App - Movies',
    canMatch: [roleGuard],
    data: {
      roles: ['BasicUser', 'AdminUser'],
    },
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Todo App - Admin',
    canMatch: [roleGuard],
    data: {
      roles: ['AdminUser'],
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Todo App - Sign In',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Todo App - Sign Up',
  },
];
