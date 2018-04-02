import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import 'rxjs/add/operator/map';

import { Course } from './course.model';

const AllCoursesQuery = gql`
  query allCourses {
    allCourses {
      id
      name
      description
      level
    }
  }
`;

const CreateCourseMutation = gql`
  mutation CreateCourse ($input: CreateCourse!) {
    createCourse(input: $input) {
      id
      name
      description
      level
    }
  }
`;

const UpdateCourseMutation = gql`
  mutation UpdateCourse($input: UpdateCourse!) {
    updateCourse(input: $input) {
      id
      name
      description
      level
    }
  }
`;

const DeleteCourseMutation = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
      name
      description
      level
    }
  }
`;

interface QueryResponse {
  allCourses;
}

@Injectable()
export class CoursesService {
  constructor(private apollo: Apollo) {}

  all() {
    return this.apollo
      .watchQuery<QueryResponse>({
        query: AllCoursesQuery
      })
      .valueChanges.map(({ data }) => data.allCourses);
  }

  create(course: Course) {
    return this.apollo.mutate({
      mutation: CreateCourseMutation,
      variables: {
        name: course.name,
        description: course.description,
        level: course.level
      },
      refetchQueries: [
        {
          query: AllCoursesQuery
        }
      ]
    });
  }

  update(course: Course) {
    return this.apollo.mutate({
      mutation: UpdateCourseMutation,
      variables: {
        id: course.id,
        name: course.name,
        description: course.description,
        level: course.level
      },
      refetchQueries: [
        {
          query: AllCoursesQuery
        }
      ]
    });
  }

  delete(course: Course) {
    return this.apollo.mutate({
      mutation: DeleteCourseMutation,
      variables: {
        id: course.id
      },
      refetchQueries: [
        {
          query: AllCoursesQuery
        }
      ]
    });
  }
}
