import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [NgOptimizedImage, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  username = '';
  password = '';
  email = '';
  errorMsg = '';
  usersSvc = inject(UsersService);
  router = inject(Router);
  currentRoute = inject(ActivatedRoute);

  signUp() {
    this.usersSvc.signUp(this.username, this.password, this.email).subscribe({
      next: (_) => {
        this.router.navigate(['..'], { relativeTo: this.currentRoute });
      },
      error: (e) => {
        this.errorMsg = e.error.detail || e.error;
      },
    });
  }
}
