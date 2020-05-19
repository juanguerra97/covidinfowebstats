import {Component, OnInit} from '@angular/core';
import { CasoCovid } from './CasoCovid';
import { CasoCovidService } from './caso-covid.service';
import {filtrarPorDepartamento, filtrarPorMunicipio, filtrarPorPais} from './filtros';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public casos: CasoCovid[] = [];
  public paisFiltro: string = null;
  public deptoFiltro: string = null;
  public municipioFiltro: string = null;

  porPaisChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Casos por pais'
    }
  };
  porPaisChartLabels: Label[] = [];
  porPaisChartType: ChartType = 'pie';
  porPaisChartLegend = true;
  porPaisChartPlugins = [];
  porPaisChartData: ChartDataSets[] = [];
  public mostrarChartPorPais = false;

  porDepartamentoChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Casos por departamento'
    }
  };
  porDepartamentoChartLabels: Label[] = [];
  porDepartamentoChartType: ChartType = 'pie';
  porDepartamentoChartLegend = true;
  porDepartamentoChartPlugins = [];
  porDepartamentoChartData: ChartDataSets[] = [];
  public mostrarChartPorDepartamento = false;

  porMunicipioChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Casos por municipio'
    }
  };
  porMunicipioChartLabels: Label[] = [];
  porMunicipioChartType: ChartType = 'pie';
  porMunicipioChartLegend = true;
  porMunicipioChartPlugins = [];
  porMunicipioChartData: ChartDataSets[] = [];
  public mostrarChartPorMunicipio = false;

  constructor(private casoCovidService: CasoCovidService) { }

  ngOnInit(): void {
    this.casoCovidService.getAll().subscribe((res: any) => {
      this.casos = res.registros;
      this.crearChartPorPais();
    }, console.error);
  }

  public onPaisClicked(event: any): void {
    if (event.active.length > 0) {
      const pais = this.porPaisChartLabels[event.active[0]._index].toString();
      if (pais !== this.paisFiltro) {
        this.paisFiltro = pais;
        this.crearChartPorDepartamento();
        this.mostrarChartPorMunicipio = false;
      }
    }
  }

  public onDeptoClicked(event: any): void {
    if (event.active.length > 0) {
      const depto = this.porDepartamentoChartLabels[event.active[0]._index].toString();
      if (depto !== this.deptoFiltro) {
        this.deptoFiltro = depto;
        this.crearChartPorMunicipio();
      }
    }
  }

  public onMunicipioClicked(event: any): void {
    if (event.active.length > 0) {
      const municipio = this.porMunicipioChartLabels[event.active[0]._index].toString();
      if (municipio !== this.deptoFiltro) {
        this.municipioFiltro = municipio;
      }
    }
  }

  private crearChartPorPais(): void {
    this.porPaisChartLabels = [];
    const casosPorPais: number[] = [];
    const resumen = groupBy(this.casos, 'pais');
    for (const prop of Object.keys(resumen)) {
      this.porPaisChartLabels.push(prop);
      casosPorPais.push(resumen[prop].length);
    }
    this.porPaisChartData = [{data: casosPorPais, label: 'Casos por pais'}];
    this.mostrarChartPorPais = true;
  }

  private crearChartPorDepartamento(): void {
    this.porDepartamentoChartLabels = [];
    const casosPorDepartamento: number[] = [];
    const casos = filtrarPorPais(this.casos, this.paisFiltro);
    const resumen = groupBy(casos, 'departamento');
    for (const prop of Object.keys(resumen)) {
      this.porDepartamentoChartLabels.push(prop);
      casosPorDepartamento.push(resumen[prop].length);
    }
    this.porDepartamentoChartData = [{data: casosPorDepartamento, label: 'Casos por departamento'}];
    this.mostrarChartPorDepartamento = true;
  }

  private crearChartPorMunicipio(): void {
    this.porMunicipioChartLabels = [];
    const casosPorMunicipio: number[] = [];
    let casos = filtrarPorPais(this.casos, this.paisFiltro);
    casos = filtrarPorDepartamento(casos, this.deptoFiltro);
    const resumen = groupBy(casos, 'municipio');
    for (const prop of Object.keys(resumen)) {
      this.porMunicipioChartLabels.push(prop);
      casosPorMunicipio.push(resumen[prop].length);
    }
    this.porMunicipioChartData = [{data: casosPorMunicipio, label: 'Casos por municipio'}];
    this.mostrarChartPorMunicipio = true;
  }

  public print(obj: any): void {
    console.log(obj);
  }

}

function groupBy(xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
