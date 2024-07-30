import { ChangeDetectorRef, Component, Input, ViewChildren, ElementRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { QueryList } from '@angular/core';
interface Slide {
  imageUrl: string;
  quote: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // userSub:Subscription;
  slides: Slide[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1596189181426-7f63a1737f0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlY2lwZXxlbnwwfDB8MHx8fDI%3D',
      quote: '"Food is the ingredient that binds us together."',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1586197103709-a0b1f31b76ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlY2lwZXxlbnwwfDB8MHx8fDI%3D',
      quote: '"Eating is a necessity, but cooking is an art."',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1593967858208-67ddb5b4c406?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlY2lwZXxlbnwwfDB8MHx8fDI%3D',
      quote: '"Food is the universal language of happiness."',
    },
  ];
  currentSlideIndex: number = 0;
  slideInterval: any;

  isAuthenticated:boolean = false;
  
  
  constructor(private authService:AuthService, private cd: ChangeDetectorRef){}

  // ngOnint(){
  //   this.userSub = this.authService.user.subscribe(user =>{
  //     this.isAuthenticated = !!user;
  //     // console.log(!user);
  //     console.log("user authentication status: ",!!user);
  //     this.cd.detectChanges();
  //   });
  // }

  ngOnInit(){
    this.authService.isAuthenticated.subscribe(res =>{
      this.isAuthenticated = res;
    });
    this.startSlideshow();
  }
  
  

  // ngOnDestroy() { // Implement OnDestroy to clean up the subscription
  //   if (this.userSub) {
  //     this.userSub.unsubscribe();
  //   }
  // }


  // for slideshow
  
  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.showNextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  showNextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
