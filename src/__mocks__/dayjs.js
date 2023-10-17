const mock = jest.genMockFromModule("dayjs");
const utc = jest.requireActual("dayjs/plugin/utc");
const dayjs = jest.requireActual("dayjs");
dayjs.extend(utc);

module.exports = dayjs;
