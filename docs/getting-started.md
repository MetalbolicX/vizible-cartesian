# Getting Started

## Pre-requisites

To work with Node.js, you must have version 18 or higher installed..

Check your Node.js version with the following command:

```sh
node -v
```

If you do not have Node.js installed in your current environment, or the installed version is too low, you can use [nvm](https://github.com/nvm-sh/nvm) to install the latest version of Node.js.

## Setup the project

[Vite](https://vitejs.dev/) is a build tool that allows you to create a project quickly and easily. It is recommended to use it to set up the project.

To create a new project with Vite, you can use the following commands:

<!-- tabs:start -->

### **npm**

```sh
npm create vite@latest
```

### **pnpm**

```sh
pnpm create vite
```

### **yarn**

```sh
yarn create vite
```

### **bun**

```sh
bun create vite
```

### **deno**

```sh
deno init --npm vite
```

<!-- tabs:end -->

## Usage

To use the `vizible-cartesian` web component, you can either install it using Node.js or include it via a CDN.

### Install using a package manager

To install the `vizible-cartesian` web component using any JavaScript package manager, you can use the following command:

<!-- tabs:start -->

#### **npm**

```sh
npm i vizible-cartesian
```

#### **pnpm**

```sh
pnpm add vizible-cartesian
```

#### **yarn**

```sh
yarn add vizible-cartesian
```

#### **bun**

```sh
bun add vizible-cartesian
```

#### **deno**

```sh
deno add --npm vizible-cartesian
```

<!-- tabs:end -->

### Include via CDN

To include the `vizible-cartesian` web component via a CDN, you can use the following script tag in your HTML file:

<!-- tabs:start -->

#### **jsdelivr**

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/vizible-cartesian/dist/index.js"
  lang="javascript"
></script>
```

#### **unpkg**

```html
<script
  type="module"
  src="https://unpkg.com/vizible-cartesian/dist/index.js"
  lang="javascript"
></script>
```

<!-- tabs:end -->

**Example:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example</title>
    <script type="module" src="https://unpkg.com/d3@7.9.0/dist/d3.min.js" lang="javascript"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/vizible-cartesian/dist/index.js" lang="javascript"></script>
  </head>
  <body>
    <figure>
      <svg width="400" height="400"></svg>
    </figure>
    <script type="module">
      import { ScatterChart } from 'vizible-cartesian';

      const svg = d3.select('svg');

      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 5 },
        { x: 4, y: 4 }
      ];

      const chart = new ScatterChart(data, {
        xSerie: { key: 'x' },
        ySeries: [{ key: 'y', color: 'blue', name: 'Y Axis', radii: 5 }],
      });

      chart.renderSeries(svg);
      chart.renderXAxis(svg);
      chart.renderYAxis(svg);
    </script>
  </body>
</html>
```
