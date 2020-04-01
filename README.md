# hummock

Caching responses from real api and use it as the stubbed data

Powered by talkback

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
