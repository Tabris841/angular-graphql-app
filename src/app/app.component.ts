import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ROUTER_ANIMATION } from './router-animations';
import { MatSnackBar } from '@angular/material';
import { NotificationsService } from './shared/notifications.service';

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
}
