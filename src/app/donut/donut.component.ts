import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css']
})
export class DonutComponent {

     // doughnut
     public doughnutChartOptions: ChartOptions<'doughnut'> = {
      responsive: false,
    };
    public doughnutChartLabels = [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ];
    public doughnutChartDatasets = [ {
      data: [ 300, 500, 100 ]
    } ];
    public doughnutChartLegend = true;
    public doughnutChartPlugins = [];
}
