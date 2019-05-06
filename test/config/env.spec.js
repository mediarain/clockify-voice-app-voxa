'use strict';

const expect = require('chai').expect;
const env = require('../../src/config/env');

describe('env', () => {
  const NODE_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = '';
  });

  afterEach(() => {
    process.env.NODE_ENV = NODE_ENV;
  });

  it('should be local without NODE_ENV', () => {
    expect(env()).to.equal('local');
  });

  it('should equal to NODE_ENV', () => {
    process.env.NODE_ENV = 'MY ENV';
    expect(env()).to.equal('MY ENV');
  });
});
