import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { User } from './user.model';

const CreateUserMutation = gql`
  mutation($input: CreateUser!) {
    createUser(input: $input) {
      id
      username
    }
  }
`;

const AllUsersQuery = gql`
  query AllUsers {
    allUsers {
      id
      username
    }
  }
`;

interface QueryResponse {
  allUsers;
}

@Injectable()
export class UsersService {
  constructor(private apollo: Apollo) {}

  all() {
    return this.apollo
      .watchQuery<QueryResponse>({
        query: AllUsersQuery
      })
      .valueChanges.map(({ data }) => data.allUsers);
  }

  create(user: User) {
    return this.apollo.mutate({
      mutation: CreateUserMutation,
      variables: {
        input: {
          username: user.username,
          password: user.password
        }
      }
    });
  }
}
