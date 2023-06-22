import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CovidService } from '../services/covid.service';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    
    datasets: [
      {data:[], label:'Confirmados'},
      {data:[], label:'Recuperados'},
      {data:[], label:'Activos'},
      {data:[], label:'Defunciones'},

    ],
    labels: []

  };

  

  public lineChartOptions = {
    responsive: true
  };
  public lineChartLegend = true;
  public lineChartType='Line';
  public lineChartPlugins=[];



  
  locale= 'es';

  countries:string[]=[];
  country:string="";

  dateInit: Date | null = null;
  dateEnd: Date | null = null;
  
  minCovDate:Date;
  maxCovDate:Date;

  constructor(
    private localservice:BsLocaleService,
    private covidService:CovidService,
    private datePipe:DatePipe
  ){
    this.localservice.use(this.locale);
    this.minCovDate= new Date('2020-1-22');
    this.maxCovDate=new Date();
    this.maxCovDate.setDate(this.maxCovDate.getDate() -1);
  }

  ngOnInit():void{
    this.getCountries();
  }

  getCountries():void{
    this.covidService.getAll().subscribe(
      data =>{
        this.countries=Object.keys(data);
      }
    )
  }


  loadData(event:any):void{
    if(this.country && this.dateInit && this.dateEnd){
      forkJoin([
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.confirmed))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.recovered))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).
        pipe(map(data => data.map(val => val.confirmed - val.recovered -val.deaths))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => val.deaths))),
        this.covidService.twoDates(this.country, this.dateInit, this.dateEnd).pipe(map(data => data.map(val => this.datePipe.transform(val.date, 'dd/MM')))),
      ]).subscribe((
        [data0,data1,data2,data3,data4]
      )=>{
        this.lineChartData.datasets[0].data=data0;
        this.lineChartData.datasets[1].data=data1;
        this.lineChartData.datasets[2].data=data2;
        this.lineChartData.datasets[3].data=data3;
        this.lineChartData.labels=data4;
      })

    }
  }

}
