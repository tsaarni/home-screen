/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_METNO_GEO_COORDINATES_LAT: string;
  readonly VITE_METNO_GEO_COORDINATES_LON: string;
  readonly VITE_METNO_USER_AGENT: string;

  readonly VITE_FINGRID_APIKEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
