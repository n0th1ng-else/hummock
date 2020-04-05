# hummock

Caching responses from real api and use it as the stubbed data.
This is a **standalone GUI application** which runs PROXY servers for every host
you provide in the config file. (see the Usage section)

Powered by [Talkback](https://www.npmjs.com/package/talkback).
For those who want to use recording features
when test own applications, **please use talkback directly**.

Rendered by [Angular](https://angular.io/) [Material](https://material.angular.io/)

# Usage

create `hummock.json` file in the root with content as listed below

```json
{
	"recordFrom": [
		{
			"host": "https://some-host.com"
		},
		{
			"host": "http://another-host-example.com"
		}
	]
}
```

run `npm start` and visit `http://localhost:3000`

[Config schema](https://github.com/n0th1ng-else/hummock/blob/master/hummock.json.schema) is located in the project root

# Config options

| Option     | Required | Default | Description                                       |
| ---------- | -------- | ------- | ------------------------------------------------- |
| autostart  | no       | `false` | Tells hummon to start proxies when app launches   |
| gui        | no       | `true`  | Turn web ui on/off                                |
| recordFrom | yes      | `[]`    | Servers that should be proxied (in form of above) |

# Custom config location

By default, hummock looks for config file in the root folder.
You can specify own config path simply running

```bash
	npm start -- --config /path/to/config/hummock.json
```

# Credits

Many thanks go to Ignacio Piantanida, who developed a brilliant package
[Talkback](https://www.npmjs.com/package/talkback). Hummock is just a wrapper on top of it which allows to run multiple talkback instances and
modify snapshot on the fly in browser window. The initial idea was to
implement the same as talkback does, so it easily covered most of cases.
