# Home Screen

This project is a web dashboard application.
It shows information such as:

- Weather forecast using [MET Norway Weather API](https://api.met.no/).
- Energy forecast using [Fingrid Open Data API](https://data.fingrid.fi/en/pages/apis) (consumption vs production in Finland).

To be implemented:

- Current time and date.
- Current and historical room temperature using time series database, collected from Zigbee sensor(s).
- Current and historical energy consumption using time series database, collected from Shelly energy meter(s).
- The hourly exchange price for [Nord Pool](https://www.nordpoolgroup.com/en/) electricity exchange using [api.spot-hinta.fi](https://spot-hinta.fi/).

The screenshot shows the current state of the project.

![Home Screen](https://i.imgur.com/bDvYX7C.png)

## Configuration

Following variables need to be stored in `.env.local` in the project root directory.

```
# latitude and longitude for weather forecast
VITE_METNO_GEO_COORDINATES_LAT=
VITE_METNO_GEO_COORDINATES_LON=

# met.no uses unique user-agent as key for api access
VITE_METNO_USER_AGENT=

# fingrid api key
VITE_FINGRID_APIKEY=
```

## Development

Compile and Hot-Reload for Development

```sh
npm run dev
```

Type-Check, Compile and Minify for Production

```sh
npm run build
```

Lint with ESLint

```sh
npm run lint
```

## Credits

- The project includes weather symbols from [Weather Icons](https://erikflowers.github.io/weather-icons/) project.
