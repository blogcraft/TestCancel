import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[] = [];
  baseUrl: string;

  cancelarSubscripciones: Subject<void> = new Subject();
  cancelarPorReejecucion: Subject<void> = new Subject();

  constructor(public http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    http.get<WeatherForecast[]>(baseUrl + 'weatherforecast').subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }

  ngOnDestroy() {
    // Esto aborta todos los request HTTP.
    this.cancelarSubscripciones.next();
    // Completa apropiadamente el subject
    this.cancelarSubscripciones.complete();

    this.cancelarPorReejecucion.complete();
  }

  infinite() {
    return this.http.get<WeatherForecast[]>(this.baseUrl + 'weatherforecast/infiniteCancel');
  }

  start() {
    this.cancelarPorReejecucion.next();

    const infin = this.infinite()
      .pipe(
        takeUntil(this.cancelarSubscripciones),
        takeUntil(this.cancelarPorReejecucion)
    );

    infin.subscribe();
  }

  end() {
    this.cancelarSubscripciones.next(); // This should send the Cancellation Token to the back end. But in .NET 6 no longer Works.
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
