/**
 * Unit tests for znFilterMatcher
 *
 * Copyright (c) WizeHive - http://www.wizehive.com
 *
 * @author	Wes DeMoney <wes@wizehive.com>
 * @since	0.5.84
 */
describe('znFilterMatcher', function() {

	var znFilterMatcher = require('../index.js');

	beforeEach(function() {

	});

	/**
	 * @author	Wes DeMoney <wes@wizehive.com>
	 * @since	0.5.84
	 */
	describe('recordMatchesFilter', function() {

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleEquals', function() {

			var record,
				filter;

			beforeEach(function() {

				record = {
					field1: 'abc'
				};

				filter = {
					and: [
						{
							prefix: '',
							attribute: 'field1',
							value: 'abc'
						}
					]
				};

			});

			it('should return true', function() {

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

			it('should return false', function() {

				record.field1 = 'def';

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

			it('should return false with null value', function() {

				record.field1 = null;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleDoesNotEqual', function() {

			var record,
				filter;

			beforeEach(function() {

				record = {
					field1: 'abc'
				};

				filter = {
					and: [
						{
							prefix: 'not',
							attribute: 'field1',
							value: 'def'
						}
					]
				};

			});

			it('should return true', function() {

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

			it('should return false', function() {

				record.field1 = 'def';

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

			it('should return true with null value', function() {

				record.field1 = null;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleMinimum', function() {

			var record,
				filter;

			beforeEach(function() {

				record = {
					field2: 6
				};

				filter = {
					and: [
						{
							prefix: 'min',
							attribute: 'field2',
							value: 5
						}
					]
				};

			});

			it('should return true', function() {

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

			it('should return true - stripped commas', function() {

				record.field2 = '$9,999.123';

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

			it('should return false - rounding', function() {

				record.field2 = '999999999.99999999';

				filter.and[0].value = '1000000000';

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

			it('should return false', function() {

				record.field2 = 4;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

			it('should return false with null value', function() {

				record.field2 = null;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleMaximum', function() {

			var record,
				filter;

			beforeEach(function() {

				record = {
					field3: 4
				};

				filter = {
					and: [
						{
							prefix: 'max',
							attribute: 'field3',
							value: 5
						}
					]
				};

			});

			it('should return true', function() {

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

			it('should return false', function() {

				record.field3 = 6;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

			it('should return false with null value', function() {

				record.field3 = null;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleContains', function() {

			var record,
				filter;

			describe('non array value', function() {

				beforeEach(function() {

					record = {
						field4: 'abc'
					};

					filter = {
						and: [
							{
								prefix: 'contains',
								attribute: 'field4',
								value: 'bc'
							}
						]
					};

				});

				it ('should return true', function() {

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it ('should return false', function() {

					filter.and[0].value = 'cd';

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('should return false with null value ', function() {

					record.field4 = null;

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

			});

			describe('array value', function() {

				beforeEach(function() {

					record = {
						field4: ['field1']
					};

					filter = {
						and: [
							{
								prefix: 'contains',
								attribute: 'field4',
								value: ['field1']
							}
						]
					};

				});

				it('should return true', function() {

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('non array filter value should return true', function() {

					filter['and'][0]['value'] = 'field1';

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('multi value array should return true', function() {

					record.field4 = ['field1', 'field2', 'field3'];

					filter.and[0].value = ['field1', 'field3'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('multi value array should return true', function() {

					record.field4 = ['field1', 'field2', 'field3'];

					filter.and[0].value = ['field1'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('should return false', function() {

					record.field4 = ['field2'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('non array filter value should return false', function() {

					filter['and'][0]['value'] = 'field2';

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('multi value array should return false', function() {

					record.field4 = ['field1', 'field2'];

					filter.and[0].value = ['field1', 'field3'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('multi value array should return false', function() {

					record.field4 = ['field1', 'field2'];

					filter.and[0].value = ['field3'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleDoesNotContain', function() {

			var record,
				filter;

			describe('non array value', function() {

				beforeEach(function() {

					record = {
						field4: 'abc'
					};

					filter = {
						and: [
							{
								prefix: 'not-contains',
								attribute: 'field4',
								value: 'cd'
							}
						]
					};

				});

				it ('should return true', function() {

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it ('should return false', function() {

					filter.and[0].value = 'bc';

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('should return true with null value', function() {

					record.field4 = null;

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

			});

			describe('array value', function() {

				beforeEach(function() {

					record = {
						field4: ['field2']
					};

					filter = {
						and: [
							{
								prefix: 'not-contains',
								attribute: 'field4',
								value: ['field1']
							}
						]
					};

				});

				it('should return true', function() {

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('non array filter value should return true', function() {

					filter['and'][0]['value'] = 'field1';

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('multi value array should return true', function() {

					record.field4 = ['field1', 'field2', 'field3'];

					filter.and[0].value = ['field1', 'field4'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('multi value array should return true', function() {

					record.field4 = ['field1', 'field2', 'field3'];

					filter.and[0].value = ['field4'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

				});

				it('should return false', function() {

					record.field4 = ['field1'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('non array filter value should return false', function() {

					filter['and'][0]['value'] = 'field2';

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('multi value array should return false', function() {

					record.field4 = ['field1', 'field2'];

					filter.and[0].value = ['field1', 'field2'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

				it('multi value array should return false', function() {

					record.field4 = ['field1', 'field2'];

					filter.and[0].value = ['field1'];

					expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

				});

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleStartsWith', function() {

			var record,
				filter;

			beforeEach(function() {

				record = {
					field5: 'abcdef'
				};

				filter = {
					and: [
						{
							prefix: 'starts-with',
							attribute: 'field5',
							value: 'abc'
						}
					]
				};

			});

			it('should return true', function() {

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

			it('should return false', function() {

				record.field5 = 'def';

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

			it('should return false with null value', function() {

				record.field5 = null;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleEndsWith', function() {

			var record,
				filter;

			beforeEach(function() {

				record = {
					field6: 'abcdef'
				};

				filter = {
					and: [
						{
							prefix: 'ends-with',
							attribute: 'field6',
							value: 'def'
						}
					]
				};

			});

			it('should return true', function() {

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(true);

			});

			it('should return false', function() {

				record.field6 = 'abc';

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

			it('should return false with null value', function() {

				record.field6 = null;

				expect(znFilterMatcher.recordMatchesFilter(record, filter)).toBe(false);

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleSubfilter option enabled', function() {

			var record,
				filter,
				options;

			beforeEach(function() {

				record = {
					field6: {
						field11: 'abcdef'
					}
				};

				filter = {
					and: [
						{
							prefix: '',
							attribute: 'field6',
							filter: {
								and: [
									{
										prefix: '',
										attribute: 'field11',
										value: 'abcdef'
									}
								]
							}
						}
					]
				};

				options = {
					subfiltering: true
				}

			});

			it('should return true', function() {

				expect(znFilterMatcher.recordMatchesFilter(record, filter, options)).toBe(true);

			});

		});

		/**
		 * @author	Wes DeMoney <wes@wizehive.com>
		 * @since	0.5.84
		 */
		describe('ruleSubfilter option not enabled', function() {

			var record,
				filter,
				options;

			beforeEach(function() {

				record = {
					field6: {
						field11: 'abcdef'
					}
				};

				filter = {
					and: [
						{
							prefix: '',
							attribute: 'field6',
							filter: {
								and: [
									{
										prefix: '',
										attribute: 'field11',
										value: 'abcdef'
									}
								]
							}
						}
					]
				};

				options = {
				}

			});

			it('should throw error', function() {

				expect(function () { znFilterMatcher.recordMatchesFilter(record, filter, options) } ).toThrow(new Error("Subfilter matching is not supported"));

			});

		});
	});



});
