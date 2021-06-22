# Stream chunker
This module implements the Node transform stream interface. It keeps an internal
buffer of a given size, and will spit out a chunk each time it fills up.

If you want to split a large file into chunks, based on a delimiter, you would
basically do this:

``` javascript
const fs = require('fs');
const StreamChunker = require('./streamChunker');
const chunker = new StreamChunker(20, '\n'); // The delimiter used here is \n
fs.createReadStream('largeDatabaseFile.csv')
  .pipe(chunker)
  .on('data', data => {
    // data here will be a chunk of 20 items.
  })
  .on('finish', () => console.log('Stream finished.'));
```


## Options
The StreamChunker constructor takes three arguments:
- chunkSize (number)
- delimiter (string)
- defaultEncoding (string, defaults to 'utf-8')
