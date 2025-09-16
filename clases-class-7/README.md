# Understanding Cors

## Code from docs

### Enable CORS for a single route

CORS (Cross-Origin Resource Sharing) is a security mechanism implemented by browsers that controls which external origins can communicate with your server. By default, the browser blocks requests coming from a domain other than the one that served the page (what we call "cross-origin").

With the [**cors**](https://www.npmjs.com/package/cors) library for Express, we can easily enable and configure these policies.

```ts
  import express from 'express';
  import cors from 'cors';

  const app = express();

  app.get('/products/:id', cors(), (req, res) => {
    res.json({ msg: 'This is CORS-enabled for a single route' });
  });

  app.listen(80, () => {
    console.log('CORS-enabled web server listening on port 80');
  });
```

**Explanation:**

- Here, only the /products/:id route allows CORS requests.

- If another route is used from another domain, the browser will block it.

- cors() without options is equivalent to allowing any origin (*).

#### The default configuration is the equivalent of:

```json
  {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
```

### Configuring CORS

```ts
  import express from 'express';
  import cors from 'cors';

  const app = express();

  const corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // IE11 y algunos SmartTVs no aceptan 204
  };

  app.get('/products/:id', cors(corsOptions), (req, res) => {
    res.json({ msg: 'This is CORS-enabled for only example.com' });
  });

  app.listen(80, () => {
    console.log('CORS-enabled web server listening on port 80');
  });

```
**Explanation:**

- Only requests from http://example.com are accepted here.

- The browser adds the Origin header to the request, and Express validates that it matches.

- optionsSuccessStatus is used in pre-flight responses for browsers that don't support 204.

Useful when an API should only be used from an official frontend.

### Configuring CORS w/ Dynamic Origin

```ts
  import express from 'express';
  import cors from 'cors';

  const app = express();

  const whitelist = ['http://example1.com', 'http://example2.com'];
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };

  app.get('/products/:id', cors(corsOptions), (req, res) => {
    res.json({ msg: 'This is CORS-enabled for a whitelisted domain' });
  });

  app.listen(80, () => {
    console.log('CORS-enabled web server listening on port 80');
  });

```

**Explanation:**

- A whitelist array is defined with the allowed domains.

- Every time a request arrives, the function is executed on origin.

- If the origin is in the list, the request is valid; otherwise, an error is thrown.

👉 Widely used when the API is shared across multiple projects, but you still want to restrict access.

⚠️ If you also want to allow tools like Postman or curl (which don't send Origin), it's recommended to add !origin:

#### If you do not want to block REST tools or server-to-server requests, add a !origin check in the origin function like so:

```ts
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }
```
In the official link you will find it with this old form:

```ts
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
```

### Enabling CORS Pre-Flight

#### Certain CORS requests are considered 'complex' and require an initial OPTIONS request (called the "pre-flight request"). An example of a 'complex' CORS request is one that uses an HTTP verb other than GET/HEAD/POST (such as DELETE) or that uses custom headers. To enable pre-flighting, you must add a new OPTIONS handler for the route you want to support:

```ts
  import express from 'express';
  import cors from 'cors';

  const app = express();

  app.options('/products/:id', cors()); // habilita pre-flight
  app.delete('/products/:id', cors(), (req, res) => {
    res.json({ msg: 'This is CORS-enabled for all origins!' });
  });

  app.listen(80, () => {
    console.log('CORS-enabled web server listening on port 80');
  });
```

**Explanation:**

- When the client performs a DELETE, the browser first sends an OPTIONS statement.

- app.options('/products/:id', cors()) automatically responds with CORS headers.

- The browser then follows up with the DELETE statement.

👉 You can enable pre-flight globally:

#### You can also enable pre-flight across-the-board like so:

```ts
  app.options('*', cors()) // include before other routes
```

### Configuring CORS Asynchronously

```ts
  import express from 'express';
  import cors from 'cors';

  const app = express();

  const whitelist = ['http://example1.com', 'http://example2.com'];
  const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if (whitelist.includes(req.header('Origin'))) {
      corsOptions = { origin: true };  // habilita el origin dinámicamente
    } else {
      corsOptions = { origin: false }; // bloquea este request
    }
    callback(null, corsOptions);
  };

  app.get('/products/:id', cors(corsOptionsDelegate), (req, res) => {
    res.json({ msg: 'This is CORS-enabled for a whitelisted domain' });
  });

  app.listen(80, () => {
    console.log('CORS-enabled web server listening on port 80');
  });
```

**Explanation:**

- corsOptionsDelegate is a function that dynamically decides whether or not a source can be accessed.

- Very useful when valid sources come from a database or an external API.

## Configuration Options

- **origin:** Configures the Access-Control-Allow-Origin CORS header. Possible values:
 - Boolean - set origin to true to reflect the request origin, as defined by req.header('Origin'), or set it to false to disable CORS.
 - String - set origin to a specific origin. For example if you set it to "http://example.com" only requests from "http://example.com" will be allowed.
 - RegExp - set origin to a regular expression pattern which will be used to test the request origin. If it's a match, the request origin will be reflected. For example the pattern /example\.com$/ will reflect any request that is coming from an origin ending with "example.com".
 - Array - set origin to an array of valid origins. Each origin can be a String or a RegExp. For example ["http://example1.com", /\.example2\.com$/] will accept any request from "http://example1.com" or from a subdomain of "example2.com".
 - Function - set origin to a function implementing some custom logic. The function takes the request origin as the first parameter and a callback (which expects the signature err [object], allow [bool]) as the second.
- **methods:** Configures the Access-Control-Allow-Methods CORS header. Expects a comma-delimited string (ex: 'GET,PUT,POST') or an array (ex: ['GET', 'PUT', 'POST']).
- **allowedHeaders:** Configures the Access-Control-Allow-Headers CORS header. Expects a comma-delimited string (ex: 'Content-Type,Authorization') or an array (ex: ['Content-Type', 'Authorization']). If not specified, defaults to reflecting the headers specified in the request's Access-Control-Request-Headers header.
- **exposedHeaders:** Configures the Access-Control-Expose-Headers CORS header. Expects a comma-delimited string (ex: 'Content-Range,X-Content-Range') or an array (ex: ['Content-Range', 'X-Content-Range']). If not specified, no custom headers are exposed.
- credentials: Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
- maxAge: Configures the Access-Control-Max-Age CORS header. Set to an integer to pass the header, otherwise it is omitted.
- preflightContinue: Pass the CORS preflight response to the next handler.
- optionsSuccessStatus: Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204.

#### The default configuration is the equivalent of:

```json
  {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
```

#### For details on the effect of each CORS header, read [this](https://web.dev/learn?hl=es-419) article on HTML5 Rocks.

## What are those callbacks that appear in some options?


#### These callbacks appear in the cors configuration options when you want the behavior to be not static, but dynamic.

When you pass a function instead of a fixed value in origin, the cors middleware needs to know whether to allow the request or not. To do this, it gives you a callback with this signature:

```ts
    (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void
```

The parameters are:

1. origin

  - The domain from which the request is made (what appears in the Origin header of the request).

  - It can be undefined if the request doesn't have an Origin (e.g., Postman or curl).

2. callback

  - This is how you respond to cors by telling it whether you accept or reject that origin.

  - It takes two arguments:

    - err: If there is an error, you pass it here.

    - allow: true if the origin is valid, false if it isn't.

### Example with whitelist

```ts
  const whitelist = ['http://example1.com', 'http://example2.com'];

  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.includes(origin)) {
        callback(null, true); // ✅ Permitir
      } else {
        callback(new Error('Not allowed by CORS')); // ❌ Rechazar
      }
    }
  };
```

**What happens here step by step:**

- A request arrives with Origin: http://example1.com.

- Express executes the function on origin.

- It checks if origin is in the array.

- If yes → we call callback(null, true) → the middleware adds the CORS headers.

- If not → we call callback(new Error(...)) → the request is blocked.