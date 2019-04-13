import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {timeout, catchError} from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['../home/home.component.css']
})


export class FormComponent implements OnInit {
  constants: any;
  articleURL = 'https://elisatheai.me/api/article';
  postURL = 'https://elisatheai.me/api/post';
  newsURL = 'https://elisatheai.me/api/url_predict';

  constructor(private http: HttpClient, private _router: Router) {
  }

  ngOnInit() {
  }

  showArticle() {
    document.getElementById('article').style.display = 'block';
    document.getElementById('post').style.display = 'none';
    document.getElementById('article_button').className = 'btn btn-dark btn-lg';
    document.getElementById('post_button').className = 'btn btn-secondary btn-lg';
    document.getElementById('postMessage').innerText = '';
    document.getElementById('errorArticle').innerHTML = '';
    document.getElementById('success').innerHTML = '';

  }

  showPost() {
    document.getElementById('article').style.display = 'none';
    document.getElementById('post').style.display = 'block';
    document.getElementById('article_button').className = 'btn btn-secondary btn-lg';
    document.getElementById('post_button').className = 'btn btn-dark btn-lg';
    document.getElementById('success').innerHTML = '';
    document.getElementById('postMessage').innerText = '';
    document.getElementById('errorArticle').innerHTML = '';
  }



  articlePOST(headline: string, content: string): void {
    headline = headline.trim();
    content = content.trim();
    const message = document.getElementById('errorMessage');

    message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;';
    if ( headline.length < 5 || headline.length > 200) {
      message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
      'Length is ' + headline.length + '. Headline length should be > 5 and < 200 characters.';
      document.getElementById('errorButton').click();
      return;
    }
    if (content.length < 1000 || content.length > 5000) {
      message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
      'Length is ' + content.length + '. Content length should be > 1000 and < 5000 characters.';
      document.getElementById('errorButton').click();
      return;
    }
    document.getElementById('loadButton').click();

    const req = this.http.post(this.articleURL, {
      headline: headline,
      content: content
    }).pipe(
      timeout(5000)
    ).subscribe(
        res => {
          document.getElementById('loadButton').click();
          if (res['message']['status'] === 'success') {

            // store API data in session for reference
            sessionStorage.setItem('response', JSON.stringify(res));

            // compute % and class
            const percentage = Math.round(res['prediction']['probability'] * 100);
            const predicted_class = res['prediction']['predicted_class'];

            // show in-depth analysis button
            document.getElementById('showDashboard').style.display = 'block';

            // show success modal
            document.getElementById('succMessage').innerHTML = '<p style="font-size:30px;"><b style="font-weight:bold;">Prediction:</b> ' +
                                                                 predicted_class  +
                                      '</p><br/><h1 align="center" style="font-size:20vh;">' + percentage + '%</h1>NOTE: For in-depth' +
                                      ' anal' + 'ysis use below button.';
            document.getElementById('successButton').click();

            // clear the form content
            document.getElementById('head').innerText = 'Headline';
            document.getElementById('head').style.color = 'black';
            document.getElementById('cont').innerText = 'Content';
            document.getElementById('cont').style.color = 'black';
            (document.getElementById('headline') as HTMLInputElement).value = '';
            (document.getElementById('content') as HTMLInputElement).value = '';

          } else {

            // show error modal
            message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + res['message']['description'];
            document.getElementById('errorButton').click();

          }
        },
        err => {
          try {
            document.getElementById('loadButton').click();
            if (err.statusText === 'Unknown Error') {
              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' API is offline. <a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
            } else if (err.error.message.status === 'error') {

              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' Looks like server is angry.' + '<a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
            } else {
              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' We are having a bad day. Try again.' + ' <a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
            }
            document.getElementById('errorButton').click();

          } catch {
            message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
             ' We are having a bad day. Try again';
             document.getElementById('errorButton').click();

          }
        }
      );
    return;

  }

  submitPost(post: string, platform: any) {
    const message = document.getElementById('errorMessage');

    message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;';
    if (post === '') {
      message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' Enter some content.';
      document.getElementById('errorButton').click();
      return false;
    }

    if (!(post.length > 4 && post.length < 31)) {
      message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' Length should be greater than 4 and less than 31.';
      document.getElementById('errorButton').click();
      return false;
    }


    if (platform.length === 0) {
    message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' Select any platform.';
    document.getElementById('errorButton').click();
    return false;
    }

    document.getElementById('loadButton').click();

    const req = this.http.post(this.postURL, {
      post: post,
      social_media: platform
    }).pipe(
      timeout(5000)
      ).subscribe(
        res => {
          document.getElementById('loadButton').click();
          const json = JSON.stringify(res);

          message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;';

          if (res['message']['status'] === 'success') {
            const prediction = Math.round(res['prediction'] * 100);
            document.getElementById('succMessage').innerHTML = '<p style="font-size:30px;"><b style="font-weight:bold;">Input:</b> ' +
                                                                 res['user_input']['post'] +
                                      '</p><br/><h1 align="center" style="font-size:20vh;">' + prediction + '%</h1>';
            document.getElementById('pos').style.color = 'black';
            document.getElementById('pos').innerText = 'Social Media Post';
            (document.getElementById('postData') as HTMLInputElement).value = '';
            (document.getElementById('platform') as HTMLInputElement).value = '';
            document.getElementById('successButton').click();
            return;
          } else {

            message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + res['message']['description'];
            document.getElementById('errorButton').click();
            return false;
          }

        },
        err => {
          try {
            document.getElementById('loadButton').click();
            if (err.statusText === 'Unknown Error') {
              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' API is offline. <a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
              document.getElementById('errorButton').click();
            } else if (err.error.message.status === 'error') {

              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              'Looks like server is angry.' + ' <a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
              document.getElementById('errorButton').click();
            } else {
              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              'We are having a bad day.' + ' <a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
               document.getElementById('errorButton').click();
            }
            document.getElementById('errorButton').click();

          } catch {
            message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
             'We are having a bad day. Try again.';
             document.getElementById('errorButton').click();

          }
        }
      );
    return true;

  }

  urlPOST(url_link) {
    const message = document.getElementById('errorMessage');

    message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;';

    if (!this.validURL(url_link)) {
      message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + ' Check your URL.';
      document.getElementById('errorButton').click();
      return false;
    }
    document.getElementById('loadButton').click();

    const req = this.http.post(this.newsURL, {
      url: url_link
    }).pipe(
      timeout(5000)
    ).subscribe(
        res => {
          document.getElementById('loadButton').click();
          if (res['message']['status'] === 'success') {

            // store API data in session for reference
            sessionStorage.setItem('response', JSON.stringify(res));

            // compute % and class
            const percentage = Math.round(res['prediction']['probability'] * 100);
            const predicted_class = res['prediction']['predicted_class'];

            // show in-depth analysis button
            document.getElementById('showDashboard').style.display = 'block';

            // show success modal
            document.getElementById('succMessage').innerHTML = '<p style="font-size:30px;"><b style="font-weight:bold;">Prediction:</b> ' +
                                                                 predicted_class  +
                                      '</p><br/><h1 align="center" style="font-size:20vh;">' + percentage + '%</h1>NOTE: For in-depth' +
                                      ' anal' + 'ysis use below button.';
            document.getElementById('successButton').click();

            // clear the form content
            document.getElementById('head').innerText = 'Headline';
            document.getElementById('head').style.color = 'black';
            document.getElementById('cont').innerText = 'Content';
            document.getElementById('cont').style.color = 'black';
            (document.getElementById('headline') as HTMLInputElement).value = '';
            (document.getElementById('content') as HTMLInputElement).value = '';

          } else {

            // show error modal
            message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' + res['message']['description'];
            document.getElementById('errorButton').click();

          }
        },
        err => {
          try {
            document.getElementById('loadButton').click();
            if (err.statusText === 'Unknown Error') {
              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' API is offline. <a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
            } else if (err.error.message.status === 'error') {

              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' Looks like server is angry.' + '<a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
            } else {
              message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
              ' We are having a bad day. Try again.' + ' <a style="color:red;" href="contact">&nbsp;<u>Report us!</u></a>';
            }
            document.getElementById('errorButton').click();

          } catch {
            message.innerHTML = '<i class="fa fa-times-circle"></i>&nbsp;' +
             ' We are having a bad day. Try again';
             document.getElementById('errorButton').click();

          }
        }
      );
    return;
  }

  validURL(str) {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex .test(str)) {
      return false;
    } else {
      return true;
    }
    }

}
