import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../session.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import * as c3 from 'c3';
declare var $: any;
import { Router } from '@angular/router';
import * as d3 from 'd3';

import * as Highcharts from 'highcharts';

declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

import Histogram from 'highcharts/modules/histogram-bellcurve';
Histogram(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

const Wordcloud = require('highcharts/modules/wordcloud');
Wordcloud(Highcharts);

@Component({
  selector: 'app-session-stats',
  templateUrl: './session-stats.component.html',
  styleUrls: ['./session-stats.component.scss'],
})
export class SessionStatsComponent implements OnInit, OnDestroy {
  currentSession: any;
  sessionStatsDetails: any;
  private subject = new Subject<void>();

  public activity;
  public xData;
  public label;
  options: any;

  constructor(private sessionService: SessionService, private router: Router) {
    
  }

  initWordCloud(wordCloudData : string)
  {
    var text = this.removeStopWordfromString(wordCloudData);
    var obj = { name: '', weight: 0 };
    var lines = text.split(/[,\. ]+/g),
      data = Highcharts.reduce(
        lines,
        function (arr, word) {
          obj = Highcharts.find(arr, function (obj) {
            return obj.name === word;
          });
          if (obj) {
            obj.weight += 1;
          } else {
            obj = {
              name: word,
              weight: 1,
            };
            arr.push(obj);
          }
          return arr;
        },
        []
      );

    this.options = {
      chart: {
        height: 225
      },
      accessibility: {
        screenReaderSection: {
          beforeChartFormat:
            '<h5>{chartTitle}</h5>' +
            '<div>{chartSubtitle}</div>' +
            '<div>{chartLongdesc}</div>'
        },
      },
      series: [
        {
          type: 'wordcloud',
          data: data,
          name: 'Occurrences',
        },
      ],
      title: {
        text: '',
      },
    };
    setTimeout(() => {
      Highcharts.chart('wordCloudData', this.options);
    }, 2000);
  }

  ngOnInit(): void {
    this.currentSession = this.sessionService.getCurrentSession();
    if (!this.currentSession.topic) {
      this.router.navigate(['/']);
    } else {
      this.sessionService
        .getSessionStats()
        .pipe(takeUntil(this.subject))
        .subscribe((sessionStatsObject: any) => {
          this.populateStats(sessionStatsObject.meetingStats[0]);
          if(sessionStatsObject.meetingTranscriptRaw) {this.initWordCloud(sessionStatsObject.meetingTranscriptRaw)};
        });
    }
  }

  ngAfterViewInit() {
   
  }

  populateStats(meetingStats) {
    const durationChartValues = {
      key: [],
      value: [],
    };
    if (meetingStats) {
      const localTimeDurationStats = JSON.parse(meetingStats['timeDurationStats']);
      for (const timeRange in localTimeDurationStats) {
        localTimeDurationStats[timeRange] =
          (localTimeDurationStats[timeRange] / meetingStats['noOfParticipants']) * 100;
        durationChartValues['key'].push(timeRange);
        durationChartValues['value'].push(Math.round(localTimeDurationStats[timeRange]));
      }
      meetingStats['timeDurationStats'] = localTimeDurationStats;
      this.sessionStatsDetails = meetingStats;
      durationChartValues.value.unshift('Participants interaction %');
      this.drawChart(durationChartValues);
    }
  }

  drawChart(durationChartValues) {
    setTimeout(
      (durationChartValues) => {
        let select: any = d3.select('#chart');
        return c3.generate({
          bindto: select,
          data: {
            columns: [durationChartValues.value],
            type: 'bar',
            color: () => {
              return '#42428B';
            },
          },
          // onresize: () => {
          //   let height = $('#chart').height();
          //   let width = $('#chart').width();
          //   //resize({height: height, width: width});
          // },
          axis: {
            x: {
              type: 'category',
              categories: durationChartValues.key,
            },
            y: {
              tick: {
                format: function (d) {
                  return d + '%';
                },
              },
            },
          },
          legend: {
            show: false,
          },
        });
      },
      100,
      durationChartValues
    );
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  removeStopWordfromString(data : string){

    let stopwords_cellstring=['a', 'about', 'above', 'above', 'across', 'after', 
    'afterwards', 'again', 'against', 'all', 'almost', 'alone', 'along', 
    'already', 'also','although','always','am','among', 'amongst', 'amoungst', 
    'amount',  'an', 'and', 'another', 'any','anyhow','anyone','anything','anyway', 
    'anywhere', 'are', 'around', 'as',  'at', 'back','be','became', 'because','become',
    'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being', 'below',
    'beside', 'besides', 'between', 'beyond', 'bill', 'both', 'bottom','but', 'by',
    'call', 'can', 'cannot', 'cant', 'co', 'con', 'could', 'couldnt', 'cry', 'de',
    'describe', 'detail', 'do', 'done', 'down', 'due', 'during', 'each', 'eg', 'eight',
    'either', 'eleven','else', 'elsewhere', 'empty', 'enough', 'etc', 'even', 'ever', 
    'every', 'everyone', 'everything', 'everywhere', 'except', 'few', 'fifteen', 'fify',
    'fill', 'find', 'fire', 'first', 'five', 'for', 'former', 'formerly', 'forty', 'found',
    'four', 'from', 'front', 'full', 'further', 'get', 'give', 'go', 'had', 'has', 'hasnt',
    'have', 'he', 'hence', 'her', 'here', 'hereafter', 'hereby', 'herein', 'hereupon', 
    'hers', 'herself', 'him', 'himself', 'his', 'how', 'however', 'hundred', 'ie', 'if',
    'in', 'inc', 'indeed', 'interest', 'into', 'is', 'it', 'its', 'itself', 'keep', 'last',
    'latter', 'latterly', 'least', 'less', 'ltd', 'made', 'many', 'may', 'me', 'meanwhile',
    'might', 'mill', 'mine', 'more', 'moreover', 'most', 'mostly', 'move', 'much', 'must',
    'my', 'myself', 'name', 'namely', 'neither', 'never', 'nevertheless', 'next', 'nine',
    'no', 'nobody', 'none', 'noone', 'nor', 'not', 'nothing', 'now', 'nowhere', 'of', 'off',
    'often', 'on', 'once', 'one', 'only', 'onto', 'or', 'other', 'others', 'otherwise',
    'our', 'ours', 'ourselves', 'out', 'over', 'own','part', 'per', 'perhaps', 'please',
    'put', 'rather', 're', 'same', 'see', 'seem', 'seemed', 'seeming', 'seems', 'serious',
    'several', 'she', 'should', 'show', 'side', 'since', 'sincere', 'six', 'sixty', 'so',
    'some', 'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhere', 
    'still', 'such', 'system', 'take', 'ten', 'than', 'that', 'the', 'their', 'them',
    'themselves', 'then', 'thence', 'there', 'thereafter', 'thereby', 'therefore', 
    'therein', 'thereupon', 'these', 'they', 'thickv', 'thin', 'third', 'this', 'those',
    'though', 'three', 'through', 'throughout', 'thru', 'thus', 'to', 'together', 'too',
    'top', 'toward', 'towards', 'twelve', 'twenty', 'two', 'un', 'under', 'until', 'up',
    'upon', 'us', 'very', 'via', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when',
    'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein',
    'whereupon', 'wherever', 'whether', 'which', 'while', 'whither', 'who', 'whoever',
    'whole', 'whom', 'whose', 'why', 'will', 'with', 'within', 'without', 'would', 'yet',
    'you', 'your', 'yours', 'yourself', 'yourselves', 'the'];

    let res = []
    let words = data.split(' ')
    for(let i=0;i<words.length;i++) {
       let word_clean = words[i].split(".").join("").toLowerCase();
       if(!stopwords_cellstring.includes(word_clean)) {
           res.push(word_clean)
       }
    }
    return(res.join(' '));
  }
}
