import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { User } from './user.model';

const serverUrl = 'http://localhost:3000';

const CreateUserMutation = gql`
  mutation($input: CreateUser!) {
    createUser(input: $input) {
      id
      username
    }
  }
`;

@Injectable()
export class UsersService {
  constructor(private apollo: Apollo, private http: HttpClient) {
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

  login(user: User) {
    return this.http.post<User>(`${serverUrl}/signin`, user);
  }
}
