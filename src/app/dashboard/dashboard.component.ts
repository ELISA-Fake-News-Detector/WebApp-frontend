import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../home/home.component.css'],
})


export class DashboardComponent implements OnInit {
  data: any;
  post = true;
  chart1: any;
  chart2: any;
  sentiment: any;
  ner: any;
  dependency: any;
  percentage: any;
  headline: any;
  content: any;
  reading_standard: any;
  lexical_diversity: any;
  word_count: any;
  difficult_words: any;
  element: any;
  predicted_class: any;
  res = {
    'lexical_diversity': 9.35960591133005,
    'features': {'word_dist': {'hey': 5, 'no': 1, 'lever': 1, 'oval': 1, 'office': 1, 'can': 1, 'pull': 1, 'reverse': 1},
    'word_dist_without_stopwords':  {'hey': 5, 'no': 1, 'lever': 1, 'oval': 1, 'office': 1, 'can': 1, 'pull': 1, 'reverse': 1},
    'polarity_title_pos': 58.0,
    'polarity_title_neg': 23.0,
    'polarity_title_neu': 19.0, },
    'reading_standard': ['12', '13']
};

  dict = {
    'lexical_diversity': 9.35960591133005,
    'word_dist': {'hey': 5, 'no': 1, 'lever': 1, 'oval': 1, 'office': 1, 'can': 1, 'pull': 1, 'reverse': 1},
    'word_dist_without_stopwords':  {'hey': 5, 'no': 1, 'lever': 1, 'oval': 1, 'office': 1, 'can': 1, 'pull': 1, 'reverse': 1},
    'polarity_title_pos': 58.0,
    'polarity_title_neg': 23.0,
    'polarity_title_neu': 19.0,
    'reading_standard': ['12', '13']
};


  constructor(private _router: Router, private meta: Meta) {
    if (sessionStorage.getItem('response') ===  null || sessionStorage.getItem('response') === 'undefined') {
      this._router.navigate(['']);
      return;
    }
    this.res = JSON.parse(sessionStorage.getItem('response'));
    console.log(this.res);
    this.percentage = Math.round(this.res['prediction']['probability'] * 100);
    this.predicted_class = this.res['prediction']['predicted_class'];
    this.headline = this.res['user_input']['headline'];
    this.content = this.res['user_input']['content'];
    this.reading_standard = this.res['features']['reading_standard'];
    this.lexical_diversity = Math.round(this.res['features']['lexical_diversity'] * 100) / 100;
    this.word_count = this.res['features']['word_count'];
    this.difficult_words = this.res['features']['difficult_words'];

    this.dependency = this.res['features']['dependency_html'];
    this.ner = this.res['features']['ner_html'];
  }

  ngOnInit(): void {
  // remove responsive meta tag

  // with stop words
  document.getElementById('ner').innerHTML = this.ner;
  this.chart1 = new Chart('chartLine1', {
    type: 'line',
    data: {
      labels: Object.keys(this.res['features']['word_dist']),
      datasets: [
        {
          data: Object.values(this.res['features']['word_dist']),
          label: 'Including Stopwords',
          borderColor: '#3cba9f',
          fill: false
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: true
        }],
        yAxes: [{
          display: true
        }]
      }
    }
  });
    // without stop words
    this.chart2 = new Chart('chartLine2', {
      type: 'line',
      data: {
        labels: Object.keys(this.res['features']['word_dist_without_stopwords']),
        datasets: [
          {
            data: Object.values(this.res['features']['word_dist_without_stopwords']),
            label: 'Excluding Stopwords',
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      }
    });

    // sentiment graph
    this.sentiment = new Chart('sentiment', {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [
          {
            label: 'Tone Analysis of Title',
            backgroundColor: ['green', 'red', 'blue'],
            data: [this.res['features']['polarity_title_pos'], this.res['features']
            ['polarity_title_neg'], this.res['features']['polarity_title_neu']]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Tone Analysis of Title'
        }
      }
    });

    // ner diagram
  }


  svgGenerate() {
    this.element = document.createElement('a');
    this.element.setAttribute('href', 'data:html/plain;charset=utf-8,' + encodeURIComponent(this.dependency));
    this.element.setAttribute('download', 'dependency.html');

    this.element.style.display = 'none';
    document.body.appendChild(this.element);

    this.element.click();

    document.body.removeChild(this.element);
  }


  showData() {
    document.getElementById('data').style.display = 'block';
    document.getElementById('analysis').style.display = 'none';
    document.getElementById('prediction').style.display = 'none';
    document.getElementsByClassName('data')[0].className = 'nav-link active data';
    document.getElementsByClassName('analysis')[0].className = 'nav-link analysis';
    document.getElementsByClassName('prediction')[0].className = 'nav-link prediction';
  }

  showAnalysis() {
    document.getElementById('data').style.display = 'none';
    document.getElementById('analysis').style.display = 'block';
    document.getElementById('prediction').style.display = 'none';
    document.getElementsByClassName('data')[0].className = 'nav-link data';
    document.getElementsByClassName('analysis')[0].className = 'nav-link active analysis';
    document.getElementsByClassName('prediction')[0].className = 'nav-link prediction';
  }

  showPrediction() {
    document.getElementById('data').style.display = 'none';
    document.getElementById('analysis').style.display = 'none';
    document.getElementById('prediction').style.display = 'block';
    document.getElementsByClassName('data')[0].className = 'nav-link data';
    document.getElementsByClassName('analysis')[0].className = 'nav-link analysis';
    document.getElementsByClassName('prediction')[0].className = 'nav-link prediction active';
  }
}
