import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { switchMap } from 'rxjs/operators';

import { Student } from './student.model';
import { Course } from './course.model';
import { CoursesService } from './courses.service';

const fragments = {
  courses: gql`
    fragment courseFields on Course {
      id
      name
      description
      level
    }
  `
};

const AllStudentsQuery = gql`
  query AllStudents {
    allStudents {
      id
      firstName
      lastName
      active
      courses {
        ...courseFields
      }
    }
  }
  ${fragments.courses}
`;

const CreateStudentMutation = gql`
  mutation CreateStudent($input: CreateStudent!) {
    createStudent(input: $input) {
      id
      firstName
      lastName
      active
    }
  }
`;

const UpdateStudentMutation = gql`
  mutation UpdateStudent($input: UpdateStudent!) {
    updateStudent(input: $input) {
      id
      firstName
      lastName
      active
    }
  }
`;

const DeleteStudentMutation = gql`
  mutation($id: ID!) {
    deleteStudent(id: $id) {
      id
      firstName
      lastName
      active
    }
  }
`;

interface QueryResponse {
  allStudents;
}

@Injectable()
export class StudentsService {
  constructor(private apollo: Apollo, private coursesService: CoursesService) {}

  all() {
    return this.apollo
      .watchQuery<QueryResponse>({
        query: AllStudentsQuery
      })
      .valueChanges.map(({ data }) => data.allStudents);
  }

  full() {
    return this.all().pipe(
      switchMap(students =>
        this.coursesService
          .all()
          .map(courses =>
            students.map(student => this.transformStudent(student, courses))
          )
      )
    );
  }

  create(student: Student) {
    return this.apollo.mutate({
      mutation: CreateStudentMutation,
      variables: {
        firstName: student.firstName,
        lastName: student.lastName,
        active: student.active,
        coursesIds: this.parseCourseIds(student.courses)
      },
      refetchQueries: [
        {
          query: AllStudentsQuery
        }
      ]
    });
  }

  update(student: Student) {
    return this.apollo.mutate({
      mutation: UpdateStudentMutation,
      variables: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        active: student.active,
        coursesIds: this.parseCourseIds(student.courses)
      },
      refetchQueries: [
        {
          query: AllStudentsQuery
        }
      ]
    });
  }

  delete(student: Student) {
    return this.apollo.mutate({
      mutation: DeleteStudentMutation,
      variables: {
        id: student.id
      },
      refetchQueries: [
        {
          query: AllStudentsQuery
        }
      ]
    });
  }

  private parseCourseIds(courses: Course[]) {
    return courses.filter(course => course.enrolled).map(course => course.id);
  }

  private transformStudent(student: Student, allCourses: Course[]) {
    return Object.assign({}, student, {
      courses: this.buildCourses(student.courses, allCourses)
    });
  }

  private buildCourses(enrolledCourses: Course[], allCourses: Course[]) {
    return allCourses.map(course => {
      return Object.assign({}, course, {
        enrolled: this.isEnrolled(course, enrolledCourses)
      });
    });
  }

  private isEnrolled(course: Course, enrolledCourses: Course[]) {
    return !!enrolledCourses.find(c => c.id === course.id);
  }
}
