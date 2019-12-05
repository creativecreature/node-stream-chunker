# BufferedSplitter

This module implements the Node transform stream interface. It is used to transform
a stream into a chunk size of your choosing. It keeps an internal buffer and will
spit out a chunk each time it fills up.


## Installing

To install it simply run `npm install bufferedsplitter` in a terminal.

## Options

The BufferedSplitter constructor takes three arguments. The chunkSize(number), the delimiter(string)
and an optional defaultEncoding(string, defaults to 'utf-8').


## Usage

This module has one base use-case; you want to stream a large file or network request chunk by chunk.
You might for example have a large database dump that you want to split into smaller files where each item
is seperated by a new line:

```
const fs = require('fs');
const BufferedSplitter = require('bufferedsplitter');
const splitter = new BufferedSplitter(20, '\n'); // The delimiter is \n but could be anything
fs.createReadStream('largeDatabaseFile.txt')
  .pipe(splitter)
  .on('data', data => {
    // data here will be a chunk of 20 items.
    yourWriteToFileMethod(data.toString());
  })
  .on('finish', () => console.log('Stream finished.'));
```
