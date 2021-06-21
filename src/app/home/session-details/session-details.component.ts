import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
//import { Location } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as d3 from 'd3';
import { SessionService } from '../session.service';

declare var sliderModule: any;
declare var toolbarModule: any;
declare var nodeModule: any;
declare var urlHandler: any;
declare var dataModule: any;
declare var relationshipModule: any;
declare var $: any;

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
})
export class SessionDetailsComponent implements OnInit {
  @ViewChild('graphContainer1') graphContainer: ElementRef;

  currentSession: any;
  currentProcess: any;

  @HostListener('window:popstate', ['$event'])
  onBrowserBackBtnClose(event: Event) {
    console.log('back button pressed');
    event.preventDefault();
    this.router.navigate(['/sessions']);
  }

  constructor(private sessionService: SessionService, private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          this.router.navigate(['/']);
        }
      }
    });
  }

  ngOnInit(): void {
    this.currentSession = this.sessionService.getCurrentSession();
    if (!this.currentSession.topic) {
      this.router.navigate(['/']);
    }
  }

  w = 1000;
  h = 1000;

  svg: any;

  videoID: string;

  _setClickListenerOnStart(data: any) {
    let s = this;
    // set the click event on the button
    document.getElementById('startBtn').addEventListener('click', function ($event) {
      // remove the node details initially
      let coreEl = $('.node-details');
      coreEl.css('opacity', 0);
      // activate the svg and remove the text message display...
      d3.select('.initialText').style('display', 'none');
      // start the sequence
      d3.selectAll('svg > *').remove();
      sliderModule.moveSlider(0);
      s.StartLoop(data);
    });
  }

  _scrollToBottom(container: any) {
    $(`.${container}`).css('display', 'block');
    let pos = $(`.${container}`).offset().top;

    $('body, html').animate(
      {
        scrollTop: pos,
      },
      'slow'
    );
  }

  StartLoop(dataToLoop: any, intervalTimeout = 1000) {
    let index = -1;
    let totalIterations = dataToLoop.length;

    let context = this;
    let defs = this.svg.append('svg:defs');

    this.currentProcess = window.setInterval(function () {
      index += 1;

      if (index >= totalIterations) {
        // stop iterations
        console.log('sequence complete');
        toolbarModule.updateNodeDetails(-1);
        window.clearInterval(this.currentProcess);
        this.currentProcess = undefined;
        // scroll to images
        let imageContainerSectionID = +urlHandler.videoIdToLoad + 1;

        $(`#imageContainer_${imageContainerSectionID}`).css('display', 'block');

        context._scrollToBottom('imageSection');
        return;
      }

      // below will run as long as thesequence is not completed
      nodeModule.createNode(dataToLoop[index], context.svg, defs);

      sliderModule.moveSlider(index);

      toolbarModule.updateNodeDetails(dataToLoop[index]);
      // will enter only if the node has spoken after some other node
      if (dataToLoop[index].ia !== null && dataToLoop[index].ia !== -1) {
        let currentNode;
        let previousData;
        // if both the previous and current nodes are hub
        if (dataToLoop[index - 1].ptype.toLowerCase() == 'hub' && dataToLoop[index].ptype.toLowerCase() == 'hub') {
          // do nothing
          return;
        }
        // else if previous node is hub but current node is not a hub (can be spoke / subhub / subspoke etc)
        else if (
          dataToLoop[index - 1].ptype.toLowerCase() == 'hub' &&
          dataToLoop[index].ptype.toLowerCase() !== 'hub'
        ) {
          // set current node as the current and previous node as the mainHub of the graph
          currentNode = dataToLoop[index];
          previousData = dataModule.getGraphHub();

          // relation will be created from current to previous node (here previous is MainHub)
          relationshipModule().createRelation({
            svgelem: context.svg,
            weight: dataToLoop[index].ci_no,
            x1: currentNode.x,
            y1: currentNode.y,
            x2: previousData.x,
            y2: previousData.y,
          });
        }
        // else if current node is hub but the previous is not a hub
        else if (
          dataToLoop[index].ptype.toLowerCase() == 'hub' &&
          dataToLoop[index - 1].ptype.toLowerCase() !== 'hub'
        ) {
          // previous will remain the previous but current will become the mainHub
          previousData = dataToLoop[index - 1];
          currentNode = dataModule.getGraphHub();

          // relation will be created from mainHub to previous node (non hub)
          relationshipModule().createRelation({
            svgelem: context.svg,
            weight: dataToLoop[index].ci_no,
            x1: currentNode.x,
            y1: currentNode.y,
            x2: previousData.x,
            y2: previousData.y,
          });
        }
        // if the current is not a hub (spoke / subhub / subspoke etc) and the previous is also not a hub (spoke / subhub / subspoke etc)
        else {
          // current will remain the current non hub and previous will remain the previous non hub
          currentNode = dataToLoop[index];
          previousData = dataToLoop[index - 1];
          // relation will be created from current non-hub to previous non-hub
          relationshipModule().createRelation({
            svgelem: context.svg,
            weight: dataToLoop[index].ci_no,
            x1: currentNode.x,
            y1: currentNode.y,
            x2: previousData.x,
            y2: previousData.y,
          });
        }

        currentNode = dataToLoop[index];
        previousData = dataToLoop[index - 1];

        relationshipModule().createRelation({
          svgelem: context.svg,
          weight: dataToLoop[index].ci_no,
          x1: currentNode.x,
          y1: currentNode.y,
          x2: previousData.x,
          y2: previousData.y,
        });
      }
    }, intervalTimeout);
  }

  ngAfterContentInit() {
    var width = ($('#graphContainer').width() * 95) / 100;
    var height = ($('#graphContainer').height() * 95) / 100;

    this.svg = d3.select('#graphContainer').append('svg').attr('width', width).attr('height', height);
    let config = {
      avatar_size: 100, //define the size of teh circle radius
    };

    //select('g').style('transform', 'translate(50%, 50%)') ;

    this.videoID = urlHandler.videoIdToLoad;

    let context = this;

    dataModule.getGraphData(this.videoID, height, width, this.currentSession.interactionsRawData, function (data) {
      if (data) {
        sliderModule.setSlider(data);
        // update the data sequence for hubs
        dataModule.updateHubs(data);

        // set click event on the start / analyze button
        context._setClickListenerOnStart(data);
      } else if (data === undefined) {
        console.log('An error occured while readingdata in the index.js');
      }
    });
  }

  ngOnDestroy() {
    if (this.currentProcess) {
      clearInterval(this.currentProcess);
    }
  }
}
