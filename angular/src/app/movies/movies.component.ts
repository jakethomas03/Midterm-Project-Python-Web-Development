import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbModal,
  NgbModalModule,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { Movie, MovieRequest, MoviesService } from '../services/movies.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-movies',
  imports: [FormsModule, NgbModalModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  title = '';
  year = '';
  busy = false;
  username = '';

  private modalRef?: NgbModalRef;
  constructor(
    usersSvc: UsersService,
    private readonly svc: MoviesService,
    private modalService: NgbModal
  ) {
    usersSvc.user$.subscribe((u) => (this.username = u.username));
  }

  ngOnInit(): void {
    this.svc.getMyMovies().subscribe((x) => (this.movies = x));
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-title',
      backdrop: 'static',
    });
  }

  create() {
    this.busy = true;
    this.svc
      .addMovie({ title: this.title, year: +this.year } as MovieRequest)
      .pipe(finalize(() => (this.busy = false)))
      .subscribe((_) => {
        this.ngOnInit();
        this.modalRef?.close();
      });
  }
}
