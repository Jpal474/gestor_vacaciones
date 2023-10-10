import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private scrollY = 0;

  
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.scrollY = window.scrollY;
    this.updateParallax();
  }

  private updateParallax(): void {
    const parallaxImage = document.querySelector('.parallax-image') as HTMLElement;
    if (parallaxImage) {
      parallaxImage.style.transform = `translateY(-${this.scrollY * 0.5}px)`;
    }
  }
}
