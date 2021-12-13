import { MockbaseException } from './mockbase-exception';

describe('MockbaseException', () => {
  it('should be defined', () => {
    expect(new MockbaseException(MockbaseException.TYPE_CONFLICT)).toBeDefined();
  });
});
