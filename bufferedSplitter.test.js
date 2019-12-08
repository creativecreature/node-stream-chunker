const stream = require('stream');
const BufferedSplitter = require('./bufferedSplitter');
const createReadStream = () =>
  new stream.Readable({
    read() {}
  });

describe('BufferedSplitter', () => {
  test('writes a single chunk of 5 items', async () => {
    const testString = 'test\n';
    const numWrites = 5;
    const chunkSize = 5;
    const expectedNumberOfChunks = Math.ceil(numWrites / chunkSize);
    const records = [];
    const readStream = createReadStream();
    const splitter = new BufferedSplitter(chunkSize, '\n');
    const waitForStream = () =>
      new Promise((resolve, reject) => {
        readStream
          .pipe(splitter)
          .on('data', d => records.push(d))
          .on('error', reject)
          .on('finish', resolve);
      });
    for (let i = 0; i < numWrites; i++) {
      readStream.push(testString);
    }
    readStream.push(null);
    await waitForStream();
    expect(records.length).toBe(expectedNumberOfChunks);
    expect(records.map(r => r.toString())).toEqual(
      [...new Array(expectedNumberOfChunks)].map(() => testString.repeat(chunkSize))
    );
  });

  test('writes a single chunk of 10000 items', async () => {
    const testString = 'test\n';
    const numWrites = 10000;
    const chunkSize = 10000;
    const expectedNumberOfChunks = Math.ceil(numWrites / chunkSize);
    const records = [];
    const readStream = createReadStream();
    const splitter = new BufferedSplitter(chunkSize, '\n');
    const waitForStream = () =>
      new Promise((resolve, reject) => {
        readStream
          .pipe(splitter)
          .on('data', d => records.push(d))
          .on('error', reject)
          .on('finish', resolve);
      });
    for (let i = 0; i < numWrites; i++) {
      readStream.push(testString);
    }
    readStream.push(null);
    await waitForStream();
    expect(records.length).toBe(expectedNumberOfChunks);
    expect(records.map(r => r.toString())).toEqual(
      [...new Array(expectedNumberOfChunks)].map(() => testString.repeat(chunkSize))
    );
  });

  test('writes five chunks of 10 items', async () => {
    const testString = 'test\n';
    const numWrites = 50;
    const chunkSize = 10;
    const expectedNumberOfChunks = Math.ceil(numWrites / chunkSize);
    const records = [];
    const readStream = createReadStream();
    const splitter = new BufferedSplitter(chunkSize, '\n');
    const waitForStream = () =>
      new Promise((resolve, reject) => {
        readStream
          .pipe(splitter)
          .on('data', d => records.push(d))
          .on('error', reject)
          .on('finish', resolve);
      });
    for (let i = 0; i < numWrites; i++) {
      readStream.push(testString);
    }
    readStream.push(null);
    await waitForStream();
    expect(records.length).toBe(expectedNumberOfChunks);
    expect(records.map(r => r.toString())).toEqual(
      [...new Array(expectedNumberOfChunks)].map(() => testString.repeat(chunkSize))
    );
  });

  test('writes the leftovers in an additional chunk', async () => {
    const testString = 'test\n';
    const numWrites = 51;
    const chunkSize = 10;
    const expectedNumberOfChunks = Math.ceil(numWrites / chunkSize);
    const records = [];
    const readStream = createReadStream();
    const splitter = new BufferedSplitter(chunkSize, '\n');
    const waitForStream = () =>
      new Promise((resolve, reject) => {
        readStream
          .pipe(splitter)
          .on('data', d => records.push(d))
          .on('error', reject)
          .on('finish', resolve);
      });
    for (let i = 0; i < numWrites; i++) {
      readStream.push(testString);
    }
    readStream.push(null);
    await waitForStream();
    expect(records.length).toBe(expectedNumberOfChunks);
    expect(records.map(r => r.toString())).toEqual(
      [...new Array(expectedNumberOfChunks)].map((v, i) => {
        if (i < records.length - 1) {
          return testString.repeat(chunkSize);
        }
        const remainder = numWrites % chunkSize;
        return remainder ? testString.repeat(remainder) : testString.repeat(chunkSize);
      })
    );
  });

  test('works with tabs as a delimiter', async () => {
    const delimiter = '\t';
    const testString = `test${delimiter}`;
    const numWrites = 98;
    const chunkSize = 10;
    const expectedNumberOfChunks = Math.ceil(numWrites / chunkSize);
    const records = [];
    const readStream = createReadStream();
    const splitter = new BufferedSplitter(chunkSize, delimiter);
    const waitForStream = () =>
      new Promise((resolve, reject) => {
        readStream
          .pipe(splitter)
          .on('data', d => records.push(d))
          .on('error', reject)
          .on('finish', resolve);
      });
    for (let i = 0; i < numWrites; i++) {
      readStream.push(testString);
    }
    readStream.push(null);
    await waitForStream();
    expect(records.length).toBe(expectedNumberOfChunks);
    expect(records.map(r => r.toString())).toEqual(
      [...new Array(expectedNumberOfChunks)].map((v, i) => {
        if (i < records.length - 1) {
          return testString.repeat(chunkSize);
        }
        const remainder = numWrites % chunkSize;
        return remainder ? testString.repeat(remainder) : testString.repeat(chunkSize);
      })
    );
  });

  test('works with space as a delimiter', async () => {
    const delimiter = ' ';
    const testString = `test${delimiter}`;
    const numWrites = 2081;
    const chunkSize = 17;
    const expectedNumberOfChunks = Math.ceil(numWrites / chunkSize);
    const records = [];
    const readStream = createReadStream();
    const splitter = new BufferedSplitter(chunkSize, delimiter);
    const waitForStream = () =>
      new Promise((resolve, reject) => {
        readStream
          .pipe(splitter)
          .on('data', d => records.push(d))
          .on('error', reject)
          .on('finish', resolve);
      });
    for (let i = 0; i < numWrites; i++) {
      readStream.push(testString);
    }
    readStream.push(null);
    await waitForStream();
    expect(records.length).toBe(expectedNumberOfChunks);
    expect(records.map(r => r.toString())).toEqual(
      [...new Array(expectedNumberOfChunks)].map((v, i) => {
        if (i < records.length - 1) {
          return testString.repeat(chunkSize);
        }
        const remainder = numWrites % chunkSize;
        return remainder ? testString.repeat(remainder) : testString.repeat(chunkSize);
      })
    );
  });

  test('handles cases where the data is smaller than the chunk size', async () => {
    const delimiter = ' ';
    const testString = `test${delimiter}`;
    const numWrites = 4;
    const chunkSize = 10;
    const expectedNumberOfChunks = Math.ceil(numWrites / chunkSize);
    const records = [];
    const readStream = createReadStream();
    const splitter = new BufferedSplitter(chunkSize, delimiter);
    const waitForStream = () =>
      new Promise((resolve, reject) => {
        readStream
          .pipe(splitter)
          .on('data', d => records.push(d))
          .on('error', reject)
          .on('finish', resolve);
      });
    for (let i = 0; i < numWrites; i++) {
      readStream.push(testString);
    }
    readStream.push(null);
    await waitForStream();
    expect(records.length).toBe(expectedNumberOfChunks);
    expect(records.map(r => r.toString())).toEqual(
      [...new Array(expectedNumberOfChunks)].map(() => testString.repeat(numWrites))
    );
  })
});
