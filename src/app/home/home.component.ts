import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showDashboard: boolean;

  constructor(private meta: Meta) {


    if (sessionStorage.getItem('response') ===  null || sessionStorage.getItem('response') === 'undefined') {
      this.showDashboard = false;
    } else {
      this.showDashboard = true;
    }
  }

  ngOnInit() {
    this.meta.addTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    });
  }

  closeNav() {
    alert(document.getElementById('side-menu').style.display);
  }
}
