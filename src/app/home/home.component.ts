import { Component, OnInit } from '@angular/core';

import { Student, Course, StudentsService, CoursesService } from '../shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: Course[];
  students: Student[];

  constructor(
    private coursesService: CoursesService,
    private studentsService: StudentsService
  ) {}

  ngOnInit() {
    this.getCourses();
    this.getStudents();
  }

  getCourses() {
    this.coursesService.all().subscribe(courses => (this.courses = courses));
  }

  getStudents() {
    this.studentsService
      .all()
      .subscribe(students => (this.students = students));
  }
}
