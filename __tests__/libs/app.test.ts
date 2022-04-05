import { Delays, greeter } from '@libs/app';

describe('greeter function', () => {
  const name = 'John';
  let hello: string;

  let timeoutSpy: jest.SpyInstance;

  beforeAll(async () => {
    jest.useFakeTimers();
    timeoutSpy = jest.spyOn(global, 'setTimeout');

    const p: Promise<string> = greeter(name);
    jest.runOnlyPendingTimers();
    hello = await p;
  });

  afterAll(() => {
    timeoutSpy.mockRestore();
  });

  it('delays the greeting by 2 seconds', () => {
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), Delays.Long);
  });

  it('greets a user with `Hello, {name}` message', () => {
    expect(hello).toBe(`Hello, ${name}`);
  });
});
