import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLogin:boolean= true;
  isLoading:boolean= false;
  error:string = null;


  constructor(private authService:AuthService, private router:Router){}

  //Methods for switching between sign up and login 
  onSwitch(){
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
  
    const email = form.value.email;
    const password = form.value.password;
    const username = this.isLogin ? null : form.value.username;
  
    if (this.isLogin) {         //if the user selects to login
      this.authService.onLogin(email, password).subscribe({
        next: (resData) => {
          localStorage.setItem('authToken', resData.access_token);
          console.log(resData);
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error.error.msg || 'An error occurred';
          this.isLoading = false;
        }
      });
    } else {                //if the user wants to sign up
      this.authService.onSignUp(email, username, password).subscribe({
        next: (resData) => {
          localStorage.setItem('authToken', resData.access_token);
          console.log(resData);
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Signup error:', error);
          this.error = error.error.msg || 'An error occurred';
          this.isLoading = false;
        }
      });
    }
    //resetting form after submitting 
    form.reset();
  }
}