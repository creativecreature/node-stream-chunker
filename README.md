# BufferedSplitter

This module implements the Node transform stream interface. It is used to transform
a given stream into a chunk size of your choosing.


## Installing
To install it simply run `npm install bufferedsplitter` in a terminal.


## Options
The BufferedSplitter constructor takes three arguments. The chunkSize(number), the seperator(string)
and an optional encoding(string, defaults to 'utf-8').


## Usage
This module has one base use-case; you want to stream a large file or network request chunk by chunk.
You might for example have a large database dump that you want to split into smaller files:
```
const fs = require('fs');
const BufferedSplitter = require('bufferedsplitter');
const splitter = new BufferedSplitter(20, '\n');
fs.createReadStream('largeDatabaseFile.txt')
  .pipe(splitter)
  .on('data', data => {
    // data here will be a chunk of 20 items.
    yourWriteToFileMethod(data.toString());
  })
  .on('finish', () => console.log('Stream finished.'));
```
