Copy `config/host.json-dist` to `config/host.json`

The contents of `config/host.json` should look something like this:

```javascript
{
    "port": 3000,
    "name": "Configurations API",
    "salt": "@1ntN0BuddyG0tThyme4That"
}
```

Setting | Description
--- | --- 
**port** | Port on the local machine on which the API listens
**name** | Name for this application
**salt** | Salt used for session id generation. CHANGE THIS!

