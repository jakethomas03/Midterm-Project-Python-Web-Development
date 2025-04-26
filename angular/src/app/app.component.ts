import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UsersService } from './services/users.service';

interface InternalRoute {
  path: string;
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgbDropdownModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  username = '';
  usersSvc = inject(UsersService);
  routes: InternalRoute[] = [];
  private userSubscription?: Subscription;

  ngOnInit(): void {
    this.userSubscription = this.usersSvc.user$.subscribe((user) => {
      this.username = user.username;
      const userRole = user.role;
      this.routes = [];
      if (['AdminUser', 'BasicUser'].includes(userRole)) {
        this.routes.push({ path: 'todos', text: 'Todos' });
        this.routes.push({ path: 'movies', text: 'Movies' });
      }
      if (['AdminUser'].includes(userRole)) {
        this.routes.push({ path: 'admin', text: 'Admin' });
      }
    });
  }

  logout() {
    this.username = '';
    this.usersSvc.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
