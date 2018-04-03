import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { User } from './user.model';
import { NotificationsService } from './notifications.service';
import { AuthService } from './auth.service';


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
  private username: string;

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private ns: NotificationsService,
    private authService: AuthService
  ) {}

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
