import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {timeout, catchError} from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['../home/home.component.css'],
})


export class ContactComponent implements OnInit {

  feedbackURL = 'http://elisatheai.me/api/feedback';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }


  submitFeedback(expression: string, subject: string, message: string, source: string) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;';
    document.getElementById('succMessage').innerHTML = '<i class="fa fa-check"></i>&nbsp;';

    if  (message.trim() === '') {
      errorMessage.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' Enter your message.';
      document.getElementById('errorButton').click();
      return;
    }

    if  (subject.length === 0) {
      errorMessage.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' Enter your reason for contacting.';
      document.getElementById('errorButton').click();
      return;
    }
    document.getElementById('load').style.display = 'block';

    const req = this.http.post(this.feedbackURL, {
      expression: expression,
      subject: subject,
      message: message,
      source: source
    }).pipe(
        timeout(5000)
    ).subscribe(
        res => {
          document.getElementById('load').style.display = 'none';
          if (res['status'] === 'success') {
            document.getElementById('succMessage').innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + res['description'];
            document.getElementById('successButton').click();

          } else {
            errorMessage.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' Error at server end. Mail us at gitcolab@gma  il.com';
            document.getElementById('errorButton').click();

          }
        },
        err => {
          try {
            document.getElementById('load').style.display = 'none';
            if (err.statusText === 'Unknown Error') {
              errorMessage.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' API is offline.';
              document.getElementById('errorButton').click();
            } else {
              errorMessage.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' There was some error while submitting. Try again';
              document.getElementById('errorButton').click();
            }
          } catch {
            errorMessage.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' Looks like network problem. Try again.';
            document.getElementById('errorButton').click();

          }
        }
      );
    return;
  }
}
