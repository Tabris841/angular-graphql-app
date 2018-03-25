import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ROUTER_ANIMATION } from './router-animations';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NotificationsService } from './shared/notifications.service';
import { LoginComponentComponent } from './login-component/login-component.component';

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
    private ns: NotificationsService
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
    const dialogRef = this.dialog.open(LoginComponentComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
