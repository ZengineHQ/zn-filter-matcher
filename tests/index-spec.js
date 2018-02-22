var znFilterMatcher = require('../index.js');
var matches = znFilterMatcher.recordMatchesFilter;

/**
 * Unit tests for znFilterMatcher
 *
 * Copyright (c) WizeHive - http://www.wizehive.com
 *
 * @author	Wes DeMoney <wes@wizehive.com>
 * @since	0.5.84
 */
describe('znFilterMatcher', function() {

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
					},
					field7: 'bananas'
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


			it('should return true with nested filter', function() {

				var nestedFilter =  {
					or: [
						{
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
								},
								{
									prefix: '',
									attribute: 'field7',
									value: 'bananas'
								}
							]
						}
					]
				};

				expect(znFilterMatcher.recordMatchesFilter(record, nestedFilter, options)).toBe(true);

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

describe('in operator', function() {

	/* dropdown single, radio */

	it('single-value field', function() {
		var filter = {
			and: [
				{
					prefix: 'in',
					attribute: 'field1',
					value: ['apples','bananas','OrAnGeS']
				}
			]
		};

		expect(matches({field1: 'apples'}, filter)).toBe(true);
		expect(matches({field1: 'Apples'}, filter)).toBe(true);
		expect(matches({field1: 'bananas'}, filter)).toBe(true);
		expect(matches({field1: 'oranges'}, filter)).toBe(true);
		expect(matches({field1: 'ORANGES'}, filter)).toBe(true);

		expect(matches({field1: 'pineapples'}, filter)).toBe(false);
		expect(matches({field1: 'potatoes'}, filter)).toBe(false);
		expect(matches({field1: ''}, filter)).toBe(false);
		expect(matches({field1: null}, filter)).toBe(false);
		expect(matches({field1: undefined}, filter)).toBe(false);
	});

	it('single-value field IN empty array', function() {
		var filter = {
			and: [
				{
					prefix: 'in',
					attribute: 'field1',
					value: []
				}
			]
		};
		expect(matches({field1: 'abc'}, filter)).toBe(false);
		expect(matches({field1: ''}, filter)).toBe(false);
		expect(matches({field1: null}, filter)).toBe(false);
		expect(matches({field1: undefined}, filter)).toBe(false);
	});

	/* dropdown multiple, checkbox */

	it('multi-value field (dropdown multiple, checkbox)', function() {
		var filter = {
			and: [
				{
					prefix: 'in',
					attribute: 'field1',
					value: ['apples','BaNaNaS']
				}
			]
		};
		var match = function(value) {
			return matches({field1: value}, filter);
		};

		// one value in
		expect(match(['apples'])).toBe(true);
		expect(match(['BANANAS'])).toBe(true);

		// all values
		expect(match(['apples','bananas'])).toBe(true);
		expect(match(['bananas','apples'])).toBe(true);

		// one value in, other value out
		expect(match(['apples', 'tomatoes'])).toBe(true);
		expect(match(['tomatoes', 'apples'])).toBe(true);

		// all values + an unrelated value
		expect(match(['tomatoes','bananas', 'apples'])).toBe(true);

		expect(match([])).toBe(false);
		expect(match(null)).toBe(false);
		expect(match(undefined)).toBe(false);

		expect(match([null])).toBe(false);
		expect(match([''])).toBe(false);
		expect(match(['grapes'])).toBe(false);
		expect(match(['grapes', 'tomatoes'])).toBe(false);
	});

	it('multi-value field IN empty array', function() {
		var filter = {
			and: [
				{
					prefix: 'in',
					attribute: 'field1',
					value: []
				}
			]
		};
		var match = function(value) {
			return matches({field1: value}, filter);
		};
		expect(match([])).toBe(false);
		expect(match(['apples'])).toBe(false);
		expect(match('')).toBe(false);
		expect(match(null)).toBe(false);
		expect(match(undefined)).toBe(false);
	});

	it('single value is not valid as filter value', function() {
		filter = {
			and: [
				{
					prefix: 'in',
					attribute: 'field1',
					value: 'abc'
				}
			]
		};
		expect(matches({field1: 'abc'}, filter)).toBe(false);
		expect(matches({field1: 'def'}, filter)).toBe(false);
	});
});

describe('not-in operator', function() {

	/* dropdown single, radio */

	it('single-value field', function() {
		filter = {
			and: [
				{
					prefix: 'not-in',
					attribute: 'field1',
					value: ['abc','def','hij']
				}
			]
		};
		expect(matches({field1: 'abc'}, filter)).toBe(false);
		expect(matches({field1: 'def'}, filter)).toBe(false);
		expect(matches({field1: 'hij'}, filter)).toBe(false);
		expect(matches({field1: 'xyz'}, filter)).toBe(true);
		expect(matches({field1: ''}, filter)).toBe(true);
		expect(matches({field1: null}, filter)).toBe(true);
		expect(matches({field1: undefined}, filter)).toBe(true);
	});

	it('single-value field NOT IN empty array', function() {
		var filter = {
			and: [
				{
					prefix: 'not-in',
					attribute: 'field1',
					value: []
				}
			]
		};
		expect(matches({field1: 'abc'}, filter)).toBe(true);
		expect(matches({field1: ''}, filter)).toBe(true);
		expect(matches({field1: null}, filter)).toBe(true);
		expect(matches({field1: undefined}, filter)).toBe(true);
	});

	/* dropdown multiple, checkbox */

	it('multi-value field', function() {
		var filter = {
			and: [
				{
					prefix: 'not-in',
					attribute: 'field1',
					value: ['apples','bananas']
				}
			]
		};
		var match = function(value) {
			return matches({field1: value}, filter);
		};

		// one value in
		expect(match(['apples'])).toBe(false);
		expect(match(['bananas'])).toBe(false);

		// all values
		expect(match(['apples','bananas'])).toBe(false);
		expect(match(['bananas','apples'])).toBe(false);

		// one value in, other value out
		expect(match(['apples', 'tomatoes'])).toBe(false);
		expect(match(['tomatoes', 'apples'])).toBe(false);

		// all values + an unrelated value
		expect(match(['tomatoes','bananas', 'apples'])).toBe(false);

		expect(match(null)).toBe(true);
		expect(match([])).toBe(true);
		expect(match(['grapes'])).toBe(true);
		expect(match(['grapes', 'tomatoes'])).toBe(true);
	});

	it('multi-value field NOT IN empty array', function() {
		var filter = {
			and: [
				{
					prefix: 'not-in',
					attribute: 'field1',
					value: []
				}
			]
		};
		var match = function(value) {
			return matches({field1: value}, filter);
		};
		expect(match([])).toBe(true);
		expect(match(['apples'])).toBe(true);
		expect(match(null)).toBe(true);
	});

	it('single value is not valid as filter value', function() {
		filter = {
			and: [
				{
					prefix: 'not-in',
					attribute: 'field1',
					value: 'abc'
				}
			]
		};
		expect(matches({field1: 'abc'}, filter)).toBe(false);
		expect(matches({field1: 'def'}, filter)).toBe(false);
	});
});
