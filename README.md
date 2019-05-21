<img align="right" width="200" src="https://user-images.githubusercontent.com/5006663/35962393-92074748-0cf4-11e8-9fc9-310671ceeeef.png" />

# React Safety Helmet

[![npm Version](https://img.shields.io/npm/v/react-safety-helmet.svg?style=flat-square)](https://www.npmjs.org/package/react-safety-helmet)
[![codecov](https://codecov.io/gh/openameba/react-safety-helmet/branch/master/graph/badge.svg)](https://codecov.io/gh/openameba/react-safety-helmet)
[![Build Status](https://travis-ci.org/openameba/react-safety-helmet.svg?branch=master)](https://travis-ci.org/openameba/react-safety-helmet)
[![Dependency Status](https://img.shields.io/david/openameba/react-safety-helmet.svg?style=flat-square)](https://david-dm.org/openameba/react-safety-helmet)

A fork of react-helmet that support for renderToNodeStream and thread safe, , provides both react hooks and declarative api.

This reusable React component will manage all of your changes to the document head.

Helmet _takes_ plain HTML tags and _outputs_ plain HTML tags. It's dead simple, and React beginner friendly.

*This is a fork of [react-helmet](https://github.com/nfl/react-helmet).*

## Example

### With React Hooks API `useHelmet(props)`

``` javascript
import React from "react";
import {useHelmet} from "react-safety-helmet";

function Application() {
  useHelmet({
    meta: {
      charSet: "utf-8"
    },
    title: "My Title",
    link: [
      {
        rel: "canonical",
        href: "http://mysite.com/example"
      }
    ]
  });
  return (
    <div className="application">
      {/* ... */}
    </div>
  );
};
```

### With Declarative API `<Helmet props>`

```javascript
import React from "react";
import {Helmet} from "react-safety-helmet";

class Application extends React.Component {
  render () {
    return (
        <div className="application">
            <Helmet>
                <meta charSet="utf-8" />
                <title>My Title</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            ...
        </div>
    );
  }
};
```

Nested or latter components will override duplicate changes:

```javascript
import ReactDOM from 'react-dom';
import { HelmetProvider, createHelmetStore } from 'react-safety-helmet';

function bootstrap() {
    const helmetStore = createHelmetStore();
    ReactDOM.render(
        <HelmetProvider store={helmetStore}>
            <Parent>
                <Helmet>
                    <title>My Title</title>
                    <meta name="description" content="Helmet application" />
                </Helmet>
                <Child>
                    <Helmet>
                        <title>Nested Title</title>
                        <meta name="description" content="Nested component" />
                    </Helmet>
                </Child>
            </Parent>
        </HelmetProvider>,
        document.getElementById('app')
    );
}
```

outputs:

```html
<head>
    <title>Nested Title</title>
    <meta name="description" content="Nested component">
</head>
```

See below for a full reference guide.

## Features
- Supports all valid head tags: `title`, `base`, `meta`, `link`, `script`, `noscript`, and `style` tags.
- Supports attributes for `body`, `html` and `title` tags.
- Supports server-side rendering.
- Nested components override duplicate head changes.
- Duplicate head changes are preserved when specified in the same component (support for tags like "apple-touch-icon").
- Callback for tracking DOM changes.

## Installation

Yarn:
```bash
yarn add react-safety-helmet
```

npm:
```bash
npm install --save react-safety-helmet
```

## Server Usage
To use on the server, call `store.renderStatic()` after `ReactDOMServer.renderToString` or `ReactDOMServer.renderToStaticMarkup` to get the head data for use in your prerender.

```javascript
import { createHelmetStore, HelmetProvider } from 'react-safety-helmet';

const helmetStore = createHelmetStore();
ReactDOMServer.renderToString(
    <HelmetProvider store={helmetStore}
        <Handler />
    </HelmetProvider>
);
const helmet = helmetStore.renderStatic();
```

This `helmet` instance contains the following properties:
- `base`
- `bodyAttributes`
- `htmlAttributes`
- `link`
- `meta`
- `noscript`
- `script`
- `style`
- `title`

Each property contains `toComponent()` and `toString()` methods. Use whichever is appropriate for your environment. For attributes, use the JSX spread operator on the object returned by `toComponent()`. E.g:

### As string output
```javascript
const html = `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            <div id="content">
                // React stuff here
            </div>
        </body>
    </html>
`;
```

### As React components
```javascript
function HTML () {
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
        <html {...htmlAttrs}>
            <head>
                {helmet.title.toComponent()}
                {helmet.meta.toComponent()}
                {helmet.link.toComponent()}
            </head>
            <body {...bodyAttrs}>
                <div id="content">
                    // React stuff here
                </div>
            </body>
        </html>
    );
}
```
## Server Usage with `ReactDOMServer.renderToNodeStream()` and `ReactDOMServer.renderToStaticNodeStream()`

``` javascript
new Promise((resolve, reject) => {
    const helmetStore = createHelmetStore();
    let body = '';
    ReactDOMServer.renderToNodeStream(
        <HelmetProvider store={helmetStore}>
          <App />
        </HelmetProvider>,
    )
      .on('data', (chunk) => {
        body += chunk;
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve({
          body,
          helmet: helmetStore.renderStatic(),
        });
      });
}).then(({body, helmet}) => {
    // Create html with body and helmet object
});
```

## Reference Guide

### React Hooks API `useHelmet(props)`

``` javascript
useHelmet({
  /* (optional) set to false to disable string encoding (server-only) */
  encodeSpecialCharacters: true,
  /*
    (optional) Useful when you want titles to inherit from a template:
    useHelmet({
      titleTemplate: "%s | MyAwesomeWebsite.com",
      title: "My Title"
    });

    outputs:

    <head>
        <title>Nested Title | MyAwesomeWebsite.com</title>
    </head>
  */,
  titleTemplate: "MySite.com - %s",
  /*
    (optional) used as a fallback when a template exists but a title is not defined

    useHelmet({
      defaultTitle: "My Site",
      titleTemplate: "My Site - %s"
    });

    outputs:

    <head>
        <title>My Site</title>
    </head>
  */
  defaultTitle: "My Default Title",
  /* (optional) callback that tracks DOM changes  */
  onChangeClientState: (newState) => console.log(newState),
  /* html attributes */
  htmlAttributes: {
    lang: "en"
    amp: true,
  },
  /* body attributes */
  bodyAttributes: {
    className: "root"
  },
  /* title attributes and value */
  title: `My Plain Title or ${dynamic} title`,
  titleAttributes: {
    itemProp: "name",
    lang: "en",
  },
  /* base element */
  base: {
    target: "_blank",
    href: "http://mysite.com/"
  },
  /* multiple meta elements */
  meta: [
    {
      name: "description",
      content: "Helmet application"
    },
    {
      property: "og:type",
      content: "article"
    }
  ],
  /* multiple link elements */
  link: [
    {
      rel: "canonical",
      href: "http://mysite.com/example"
    },
    {
      rel: "apple-touch-icon",
      href: "http://mysite.com/img/apple-touch-icon-57x57.png"
    },
    {
      rel: "apple-touch-icon"
      sizes: "72x72"
      href: "http://mysite.com/img/apple-touch-icon-72x72.png"
    },
    ...locales.map((locale) => ({
        rel: "alternate",
        href: `http://example.com/${locale}`
        hrefLang: locale
    }))
  ],
  /* multiple script elements */
  script: [
    {
      src: "http://include.com/pathtojs.js",
      type: "text/javascript"
    }
    /* inline script elements */
    {
      type: "application/ld+json"
      innerHTML: `
        {
            "@context": "http://schema.org"
        }
      `
    }
  ],
  noscript: [
    /* noscript elements */
    {
      innerHTML: `
        <link rel="stylesheet" type="text/css" href="foo.css" />
      `
    }
  ],
  /* inline style elements */
  style: [
    {
      innerHTML: `
        body {
            background-color: blue;
        }

        p {
            font-size: 12px;
        }
      `
    }
  ]
});
```

### Declarative API `<Helmet props>`

```javascript
<Helmet
    {/* (optional) set to false to disable string encoding (server-only) */}
    encodeSpecialCharacters={true}

    {/*
        (optional) Useful when you want titles to inherit from a template:

        <Helmet
            titleTemplate="%s | MyAwesomeWebsite.com"
        >
            <title>My Title</title>
        </Helmet>

        outputs:

        <head>
            <title>Nested Title | MyAwesomeWebsite.com</title>
        </head>
    */}
    titleTemplate="MySite.com - %s"

    {/*
        (optional) used as a fallback when a template exists but a title is not defined

        <Helmet
            defaultTitle="My Site"
            titleTemplate="My Site - %s"
        />

        outputs:

        <head>
            <title>My Site</title>
        </head>
    */}
    defaultTitle="My Default Title"

    {/* (optional) callback that tracks DOM changes */}
    onChangeClientState={(newState) => console.log(newState)}
>
    {/* html attributes */}
    <html lang="en" amp />

    {/* body attributes */}
    <body className="root" />

    {/* title attributes and value */}
    <title itemProp="name" lang="en">My Plain Title or {`dynamic`} title</title>

    {/* base element */}
    <base target="_blank" href="http://mysite.com/" />

    {/* multiple meta elements */}
    <meta name="description" content="Helmet application" />
    <meta property="og:type" content="article" />

    {/* multiple link elements */}
    <link rel="canonical" href="http://mysite.com/example" />
    <link rel="apple-touch-icon" href="http://mysite.com/img/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon" sizes-"72x72" href="http://mysite.com/img/apple-touch-icon-72x72.png" />
    {locales.map((locale) => {
        <link rel="alternate" href="http://example.com/{locale}" hrefLang={locale} />
    })}

    {/* multiple script elements */}
    <script src="http://include.com/pathtojs.js" type="text/javascript" />

    {/* inline script elements */}
    <script type="application/ld+json">{`
        {
            "@context": "http://schema.org"
        }
    `}</script>

    {/* noscript elements */}
    <noscript>{`
        <link rel="stylesheet" type="text/css" href="foo.css" />
    `}</noscript>

    {/* inline style elements */}
    <style type="text/css">{`
        body {
            background-color: blue;
        }

        p {
            font-size: 12px;
        }
    `}</style>
</Helmet>
```

### Where is `Helmet.rewind()`, `Helmet.renderStatic()` and `peek()` ?

#### Use helmetStore.renderStatic() instead of Helmet.rewind() and Helmet.renderStatic()

``` javascript
const helmetStore = createHelmetStore(() => {
  // helmetStore changed
});
ReactDOMServer.renderToString(
    <HelmetProvider store={helmetStore}>
        <Helmet>
            <title>My Title</title>
            <meta name="description" content="Helmet application" />
        </Helmet>
    </HelmetProvider>
);

const head = helmetStore.renderStatic();
```

#### Use helmetStore.peek() instead of Helmet.peek()

``` javascript
const helmetStore = createHelmetStore();
ReactDOM.render(
    <HelmetProvider store={helmetStore}>
        <Helmet>
            <title>Fancy title</title>
        </Helmet>
    </HelmetProvider>,
    container
);

helmetStore.peek().title; // "Fancy title"
```


## Contributing to this project
Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

* [Pull requests](CONTRIBUTING.md#pull-requests)
* [Development Process](CONTRIBUTING.md#development)

## License

MIT
