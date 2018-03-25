import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LoginComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      },
      { updateOn: 'blur' }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      this.dialogRef.close({
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      });
    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFieldValid(field: string) {
    return (
      !this.loginForm.get(field).valid && this.loginForm.get(field).touched
    );
  }
}
