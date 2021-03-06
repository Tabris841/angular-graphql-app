import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';

import {
  CoursesService,
  NotificationsService,
  StudentsService,
  UsersService,
  TokenInterceptor
} from './shared';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StudentsComponent } from './students/students.component';
import { StudentDetailsComponent } from './students/student-details/student-details.component';
import { StudentsListComponent } from './students/students-list/students-list.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { CoursesListComponent } from './courses/courses-list/courses-list.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './shared/auth.service';
import { UsersComponent } from './users/users.component';
import { UsersListComponent } from './users/users-list/users-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StudentsComponent,
    StudentDetailsComponent,
    StudentsListComponent,
    CoursesComponent,
    CourseDetailsComponent,
    CoursesListComponent,
    LoginComponent,
    UsersComponent,
    UsersListComponent
  ],
  entryComponents: [LoginComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule, // provides HttpClient for HttpLink
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialModule,
    ApolloModule,
    HttpLinkModule, // makes it easy to fetch data in Angular
  ],
  providers: [
    CoursesService,
    NotificationsService,
    StudentsService,
    UsersService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
      cache: new InMemoryCache()
    });
  }
}
