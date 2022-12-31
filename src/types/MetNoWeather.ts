interface Forecast {
  temperature: Temperature[];
  precipitation: Precipitation[];
}

export interface Temperature {
  time: Date;
  temperature: number; // °C
  symbol: string; // url
}
export interface Precipitation {
  time: Date;
  precipitation: number; // mm
}

// Documentation for the Met.no API
// https://api.met.no/weatherapi/locationforecast/2.0/#!/data/get_compact
// https://api.met.no/doc/ForecastJSON
const url = (lat: string, lon: string) =>
  `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
//const url = 'http://localhost:5173/weather.json';

// Icons are stored in the public folder as static assets.
const iconUrl = (icon: string) => `image:///weather-icons/${icon}.svg`;

export class MetNoWeather {
  private userAgent: string;

  constructor(userAgent: string) {
    this.userAgent = userAgent;
  }

  private getHeaders(): RequestInit {
    return {
      headers: {
        'User-Agent': this.userAgent,
        Accept: 'application/json',
      },
    };
  }

  private pickWeatherSymbol(entry: any, index: number): string {
    // Only return weather symbol for every sixth hour.
    if (index % 6 !== 1) {
      return 'none';
    }

    // Prefer the next 6 hours forecast over the next 12 hours forecast.
    const perSixHours = entry.data.next_6_hours?.summary?.symbol_code;
    const perTwelveHours = entry.data.next_12_hours?.summary?.symbol_code;
    const symbol = perSixHours || perTwelveHours || 'undefined';

    return this.getWeatherIcon(symbol);
  }

  private getWeatherIcon(weather: string): string {
    const icon = mapping.get(weather) || 'wi-na';
    // Log warning if no icon was found so that we can add it to the mapping.
    if (icon === 'wi-na') {
      console.warn(`No weather icon found for '${weather}'`);
    }
    return iconUrl(icon);
  }

  private getPrecipitation(entry: any): number {
    // Prefer the next 1 hour forecast, otherwise use the next 6 or 12 hours forecast
    // divided by the number of hours.
    const perHour = entry.data.next_1_hours?.details?.precipitation_amount;
    const perSixHours = entry.data.next_6_hours?.details?.precipitation_amount / 6;
    const perTwelveHours = entry.data.next_12_hours?.details?.precipitation_amount / 12;
    return perHour || perSixHours || perTwelveHours || 0;
  }

  async getForecast(lat: string, lon: string): Promise<Forecast> {
    const response = await fetch(url(lat, lon), this.getHeaders());
    const json = await response.json();

    // Pick two days forecast beginning  from the first item.
    const until = new Date(json.properties.timeseries[0].time);
    until.setDate(until.getDate() + 2);

    return await ({
      // Temperature forecast with weather icons.
      temperature: json.properties.timeseries
        .map(
          (entry: any, index: number) =>
            ({
              time: new Date(entry.time),
              temperature: entry.data.instant.details.air_temperature,
              symbol: this.pickWeatherSymbol(entry, index),
            } as Temperature),
        )
        .filter((entry: Temperature) => entry.time < until),

      // Precipitation forecast.
      precipitation: json.properties.timeseries
        .map(
          (entry: any) =>
            ({
              time: new Date(entry.time),
              precipitation: this.getPrecipitation(entry),
            } as Precipitation),
        )
        .filter((entry: Precipitation) => entry.time < until),
    } as Forecast);
  }
}

// Mapping from weather API to weather icons
// https',//api.met.no/weatherapi/weathericon/2.0/documentation
// https',//erikflowers.github.io/weather-icons/
const mapping = new Map<string, string>([
  ['clearsky', 'wi-day-sunny'],

  ['cloudy', 'wi-cloudy'],
  ['fair', 'wi-day-cloudy'],
  ['fog', 'wi-fog'],

  ['heavyrain', 'wi-rain'],
  ['heavyrainandthunder', 'wi-storm-showers'],
  ['heavyrainshowers', 'wi-day-showers'],
  ['heavyrainshowersandthunder', 'wi-day-storm-showers'],

  ['heavysleet', 'wi-sleet'],
  ['heavysleetandthunder', 'wi-storm-showers'],
  ['heavysleetshowers', 'wi-sleet'],
  ['heavysleetshowersandthunder', 'wi-day-sleet-storm'],

  ['heavysnow', 'wi-snow'],
  ['heavysnowandthunder', 'wi-snow'],
  ['heavysnowshowers', 'wi-snow'],
  ['heavysnowshowersandthunder', 'wi-snow'],

  ['lightrain', 'wi-sprinkle'],
  ['lightrainandthunder', 'wi-sprinkle'],
  ['lightrainshowers', 'wi-sprinkle'],
  ['lightrainshowersandthunder', 'wi-sprinkle'],

  ['lightsleet', 'wi-sleet'],
  ['lightsleetandthunder', 'wi-sleet'],
  ['lightsleetshowers', 'wi-sleet'],

  ['lightsnow', 'wi-snow'],
  ['lightsnowandthunder', 'wi-snow'],
  ['lightsnowshowers', 'wi-snow'],

  ['lightssleetshowersandthunder', 'wi-sleet'],
  ['lightssnowshowersandthunder', 'wi-sleet'],

  ['partlycloudy', 'day-cloudy'],

  ['rain', 'wi-rain'],
  ['rainandthunder', 'wi-rain'],
  ['rainshowers', 'wi-rain'],
  ['rainshowersandthunder', 'wi-rain'],

  ['sleet', 'wi-sleet'],
  ['sleetandthunder', 'wi-sleet'],
  ['sleetshowers', 'wi-sleet'],
  ['sleetshowersandthunder', 'wi-sleet'],

  ['snow', 'wi-snow'],
  ['snowandthunder', 'wi-snow'],
  ['snowshowers', 'wi-snow'],
  ['snowshowersandthunder', 'wi-snow'],

  ['clearsky_night', 'wi-night-clear'],
  ['clearsky_day', 'wi-day-sunny'],

  ['partlycloudy_night', 'wi-night-alt-cloudy'],
  ['fair_night', 'wi-night-alt-cloudy'],
  ['lightrainshowers_night', 'wi-night-alt-sprinkle'],

  ['partlycloudy_day', 'wi-day-cloudy'],
]);
