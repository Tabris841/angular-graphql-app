import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ROUTER_ANIMATION } from './router-animations';
import { MatSnackBar, MatDialog } from '@angular/material';

import { LoginComponent } from './login/login.component';
import { NotificationsService, UsersService, AuthService } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ROUTER_ANIMATION]
})
export class AppComponent implements OnInit {
  title = 'Angular GraphQL App';
  links = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/students', icon: 'face', label: 'Students' },
    { path: '/courses', icon: 'list', label: 'Courses' }
  ];

  constructor(
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private ns: NotificationsService,
    private usersService: UsersService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.ns.notifications$.subscribe(notification =>
      this.showNotification(notification)
    );
  }

  showNotification(notification) {
    this.snackbar.open(notification, 'OK', {
      duration: 3000
    });
  }

  prepareRouterState(router: RouterOutlet) {
    return router.activatedRouteData['animation'] || 'initial';
  }

  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      data: {
        buttonName: 'Login'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.authService.login(result);
    });
  }

  openCreateUser() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      data: {
        buttonName: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.usersService.create(result).subscribe(data => {
        console.log(data);
      });
    });
  }
}
