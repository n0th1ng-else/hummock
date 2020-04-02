# hummock

Caching responses from real api and use it as the stubbed data.
This is stanalone GUI tool which runs PROXY servers for every host
you provide in the config file.

Powered by [Talkback](https://www.npmjs.com/package/talkback).
For those who want to use recording features
when test own applications, **please use talkback directly**.

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
