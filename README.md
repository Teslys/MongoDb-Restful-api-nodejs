# MongoDb-Restful-api-nodejs
## Api Usage 
```
Get Collection => "http://localhost:[port]/[password]/getcollection/[Collection]"
```

```
Get Document => "http://localhost:[port]/[password]/get/[Collection]/[Field Name]/[Field Value]"
```
```
İnsert Document => "http://localhost:[port]/[password]/insert/[Collection]" // Method: [POST]
```

## Post Updated Document Data after Get Document
```
    Update Document => "http://localhost:[port]/[password]/update/[Collection]" // Method: [POST]
```

## Config
```

{
    "url": "mongodb://localhost/[databaseName]",
    "poolSize":25,
    "apiPass":"[password]",
    "port":[port]
}
```
