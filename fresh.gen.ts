// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_cookies from "./routes/_cookies.tsx";
import * as $api_getFilms from "./routes/api/getFilms.tsx";
import * as $error from "./routes/error.tsx";
import * as $film_id_ from "./routes/film/[_id].tsx";
import * as $index from "./routes/index.tsx";
import * as $projects from "./routes/projects.tsx";
import * as $Home from "./islands/Home.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_cookies.tsx": $_cookies,
    "./routes/api/getFilms.tsx": $api_getFilms,
    "./routes/error.tsx": $error,
    "./routes/film/[_id].tsx": $film_id_,
    "./routes/index.tsx": $index,
    "./routes/projects.tsx": $projects,
  },
  islands: {
    "./islands/Home.tsx": $Home,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
