export interface DataSets {
  production: DataEntry[];
  consumption: DataEntry[];
  wind: DataEntry[];
}

export interface DataEntry {
  time: Date;
  value: number;
}

// Documentation for the datasets: https://data.fingrid.fi/en/dataset/
enum DataSetName {
  // Electricity consumption forecast - updated hourly
  // Unit: MW
  // Period: 1 hour
  ConsumptionForecast = 166,

  // Electricity production prediction - updated hourly
  // Unit: MWh
  // Period: 1 hour
  ProductionForecast = 241,

  // Wind power generation forecast - updated hourly
  // Unit: MW
  // Period: 1 hour
  WindPowerForecast = 245,
}

// Documentation for the API:
// https://data.fingrid.fi/en/pages/apis
// https://data.fingrid.fi/open-data-api/
//
// Dates must be in ISO 8601 format without milliseconds.
const url = (variableId: number, start: Date, end: Date) =>
  `https://api.fingrid.fi/v1/variable/${variableId}/events/json?start_time=${
    start.toISOString().split('.')[0] + 'Z'
  }&end_time=${end.toISOString().split('.')[0] + 'Z'}`;

export class FingridOpenData {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders(): RequestInit {
    return {
      headers: new Headers({
        'x-api-key': this.apiKey,
        Accept: 'application/json',
      }),
    };
  }

  async getForecast(): Promise<DataSets> {
    const start = new Date();
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    return Promise.all([
      fetch(url(DataSetName.ConsumptionForecast, start, end), this.getHeaders()),
      fetch(url(DataSetName.ProductionForecast, start, end), this.getHeaders()),
      fetch(url(DataSetName.WindPowerForecast, start, end), this.getHeaders()),
    ]).then(async ([consumption, production, wind]) => {
      const consumptionJson = await consumption.json();
      const productionJson = await production.json();
      const windJson = await wind.json();

      return {
        consumption: consumptionJson.map((entry: any) => ({
          time: new Date(entry.start_time),
          value: entry.value,
        })),
        production: productionJson.map((entry: any) => ({
          time: new Date(entry.start_time),
          value: entry.value,
        })),
        wind: windJson.map((entry: any) => ({
          time: new Date(entry.start_time),
          value: entry.value,
        })),
      } as DataSets;
    });
  }
}
