const { Transform } = require('stream');

class BufferedSplitter extends Transform {
  constructor(chunkSize, delimiter, defaultEncoding = 'utf-8') {
    super({ defaultEncoding });
    this.chunkSize = chunkSize;
    this.delimiter = Buffer.from(delimiter);
    this.data = Buffer.from([]);
    this.leftovers = Buffer.from([]);
    this.count = 0;
  }

  _transform(chunk, encoding, callback) {
    const currentBuffer = Buffer.concat([this.leftovers, chunk]);
    this.leftovers = Buffer.from([]);
    let searchIndex = 0;
    let hasMoreSeparators = true;
    while (searchIndex < currentBuffer.length && hasMoreSeparators) {
      const delimiterIndex = currentBuffer.indexOf(this.delimiter, searchIndex, encoding);
      if (delimiterIndex !== -1) {
        this.data = Buffer.concat([
          this.data,
          currentBuffer.slice(searchIndex, delimiterIndex + this.delimiter.length)
        ]);
        this.count++;
        searchIndex = delimiterIndex + this.delimiter.length;
        if (this.count === this.chunkSize) {
          this.push(this.data);
          this.data = Buffer.from([]);
          this.count = 0;
        }
      } else {
        hasMoreSeparators = false;
        this.leftovers = currentBuffer.slice(searchIndex);
      }
    }
    callback();
  }

  _flush(callback) {
    if (this.data.length || this.leftovers.length) {
      this.push(Buffer.concat([this.data, this.leftovers]));
    }
    callback();
  }
}
module.exports = BufferedSplitter;
