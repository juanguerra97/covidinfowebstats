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
  public anoFiltro: string = null;
  public mesFiltro: string = null;
  public diaFiltro: string = null;

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

  public porSexoYPais = false;
  public porSexoYDepto = false;
  public porSexoYMunicipio = false;

  porSexoChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Casos por sexo'
    }
  };
  porSexoChartLabels: Label[] = [];
  porSexoChartType: ChartType = 'pie';
  porSexoChartLegend = true;
  porSexoChartPlugins = [];
  porSexoChartData: ChartDataSets[] = [];
  public mostrarChartPorSexo = false;

  public porAnoYPais = false;
  public porAnoYDepto = false;
  public porAnoYMunicipio = false;

  porAnoChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: 'Casos por año'
    }
  };
  porAnoChartLabels: Label[] = [];
  porAnoChartType: ChartType = 'pie';
  porAnoChartLegend = true;
  porAnoChartPlugins = [];
  porAnoChartData: ChartDataSets[] = [];
  public mostrarChartPorAno = false;

  constructor(private casoCovidService: CasoCovidService) { }

  ngOnInit(): void {
    this.casoCovidService.getAll().subscribe((res: any) => {
      this.casos = res.registros;
      this.crearChartPorPais();
      this.crearChartPorSexo();
      this.crearChartPorAno();
    }, console.error);
  }

  public onPaisClicked(event: any): void {
    if (event.active.length > 0) {
      const pais = this.porPaisChartLabels[event.active[0]._index].toString();
      if (pais !== this.paisFiltro) {
        this.paisFiltro = pais;
        this.deptoFiltro = null;
        this.municipioFiltro = null;
        this.mostrarChartPorMunicipio = false;
        this.crearChartPorDepartamento();
        if (this.porSexoYPais) {
          this.porSexoYDepto = false;
          this.porSexoYMunicipio = false;
          this.crearChartPorSexo();
        }
      }
    }
  }

  public onDeptoClicked(event: any): void {
    if (event.active.length > 0) {
      const depto = this.porDepartamentoChartLabels[event.active[0]._index].toString();
      if (depto !== this.deptoFiltro) {
        this.deptoFiltro = depto;
        this.municipioFiltro = null;
        this.crearChartPorMunicipio();
        if (this.porSexoYDepto) {
          this.porSexoYMunicipio = false;
          this.crearChartPorSexo();
        }
      }
    }
  }

  public onMunicipioClicked(event: any): void {
    if (event.active.length > 0) {
      const municipio = this.porMunicipioChartLabels[event.active[0]._index].toString();
      if (municipio !== this.municipioFiltro) {
        this.municipioFiltro = municipio;
        if (this.porSexoYMunicipio) {
          this.crearChartPorSexo();
        }
      }
    }
  }

  public onAnoClicked(event: any): void {
    if (event.active.length > 0) {
      const ano = this.porAnoChartLabels[event.active[0]._index].toString();
      if (ano !== this.anoFiltro) {
        this.anoFiltro = ano;
        this.mesFiltro = null;
        this.diaFiltro = null;
        this.crearChartPorAno();
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

  private crearChartPorSexo(): void {
    this.porSexoChartLabels = [];
    const casosPorSexo: number[] = [];
    let casos = this.casos;
    if (this.porSexoYPais) {
      casos = filtrarPorPais(this.casos, this.paisFiltro);
    }
    if (this.porSexoYDepto) {
      casos = filtrarPorDepartamento(casos, this.deptoFiltro);
    }
    if (this.porSexoYMunicipio) {
      casos = filtrarPorMunicipio(casos, this.municipioFiltro);
    }
    const resumen = groupBy(casos, 'sexo');
    for (const prop of Object.keys(resumen)) {
      this.porSexoChartLabels.push(prop);
      casosPorSexo.push(resumen[prop].length);
    }
    this.porSexoChartData = [{data: casosPorSexo, label: 'Casos por sexo'}];
    this.mostrarChartPorSexo = true;
  }

  private crearChartPorAno(): void {
    this.porAnoChartLabels = [];
    const casosPorAno: number[] = [];
    let casos = this.casos;
    if (this.porAnoYPais) {
      casos = filtrarPorPais(this.casos, this.paisFiltro);
    }
    if (this.porAnoYDepto) {
      casos = filtrarPorDepartamento(casos, this.deptoFiltro);
    }
    if (this.porAnoYMunicipio) {
      casos = filtrarPorMunicipio(casos, this.municipioFiltro);
    }
    const resumen = groupByAno(casos, 'fecha');
    for (const prop of Object.keys(resumen)) {
      this.porAnoChartLabels.push(prop);
      casosPorAno.push(resumen[prop].length);
    }
    this.porAnoChartData = [{data: casosPorAno, label: 'Casos por año'}];
    this.mostrarChartPorAno = true;
  }

  public onPorSexoYPaisChange(event: any): void {
    this.porSexoYDepto = false;
    this.porSexoYMunicipio = false;
    this.crearChartPorSexo();
  }

  public onPorSexoYDeptoChange(event: any): void {
    this.porSexoYMunicipio = false;
    this.crearChartPorSexo();
  }

  public onPorSexoYMunicipioChange(event: any): void {
    this.crearChartPorSexo();
  }

  public onPorAnoYPaisChange(event: any): void {
    this.porAnoYDepto = false;
    this.porAnoYMunicipio = false;
    this.crearChartPorAno();
  }

  public onPorAnoYDeptoChange(event: any): void {
    this.porAnoYMunicipio = false;
    this.crearChartPorAno();
  }

  public onPorAnoYMunicipioChange($event: any): void {
    this.crearChartPorAno();
  }
}

function groupBy(xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

function groupByAno(xs, keyFecha) {
  return xs.reduce((rv, x) => {
    (rv[x[keyFecha].substring(0, 4)] = rv[x[keyFecha].substring(0, 4)] || []).push(x);
    return rv;
  }, {});
}
