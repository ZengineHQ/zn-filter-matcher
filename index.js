/**
 * znFilterMatcher
 *
 * Ported code from the Zengine frontend
 *
 * Determines whether the given record matches the given filter
 *
 * Limitations vs. API filtering:
 * - Does not support subfiltering across forms
 * - Does not support dynamic filter conditions ('logged-in-user')
 *
 *
 * Copyright (c) WizeHive - http://www.wizehive.com
 *
 */
var znFilterMatcher = (function() {

	var BigNumber = require('bignumber.js');
	var isArray = Array.isArray;
	var ruleFunctionMap = {
		'': 'ruleEquals',
		'not': 'ruleDoesNotEqual',
		'min': 'ruleMinimum',
		'max': 'ruleMaximum',
		'contains': 'ruleContains',
		'not-contains': 'ruleDoesNotContain',
		'starts-with': 'ruleStartsWith',
		'ends-with': 'ruleEndsWith',
		'in': 'ruleIn',
		'not-in': 'ruleNotIn'
	};

	/**
	 * Parse a numeric value from a record field input.
	 * Strips '$' and ',' characters. If the value is not a valid number
	 * after stripping characters, 0 is returned
	 *
	 * @param	input
	 * @returns	{Number}
	 * @author	Paul W. Smith <paul@wizehive.com>
	 * @since	0.5.76
	 */
	function parseNumber(input) {
		var formatted = String(input || '')
			.replace('$', '')
			.replace(',', '');
		return formatted;
	}

	// Matchers for each rule "prefix" type
	var matchers = {
		ruleEquals: function(recordValue, ruleValue) {
			if (Array.isArray(recordValue)) {
				return false;
			}
			return String(ruleValue).toLowerCase() == String(recordValue).toLowerCase();
		},
		ruleDoesNotEqual: function(recordValue, ruleValue) {
			if (Array.isArray(recordValue)) {
				return false;
			}
			return String(ruleValue).toLowerCase() != String(recordValue).toLowerCase();
		},
		ruleMinimum: function(recordValue, ruleValue) {
			if (Array.isArray(recordValue)) {
				return false;
			}
			if (recordValue === '') {
				return false;
			}
			// Do numeric comparison if filter rule value is numeric. For consistency with API,
			// record values are somewhat forgiving, while filter rules must be a valid number
			if (ruleValue && !isNaN(Number(ruleValue))) {
				recordValue = parseNumber(recordValue);

				try {
					ruleValue = new BigNumber(ruleValue);
					recordValue = new BigNumber(recordValue);

				} catch (err) {
					return false;
				}

				return recordValue.greaterThanOrEqualTo(ruleValue);
			}
			// Loose comparison; don't use 'localeCompare' because we only want to compare
			// numbers or well-formatted dates, which work with normal string comparison
			return (recordValue >= ruleValue);
		},
		ruleMaximum: function(recordValue, ruleValue) {
			if (Array.isArray(recordValue)) {
				return false;
			}
			if (recordValue === '') {
				return false;
			}
			// Do numeric comparison if filter rule value is numeric. For consistency with API,
			// record values are somewhat forgiving, while filter rules must be a valid number
			if (ruleValue && !isNaN(Number(ruleValue))) {
				recordValue = parseNumber(recordValue);

				try {
					ruleValue = new BigNumber(ruleValue);
					recordValue = new BigNumber(recordValue);

				} catch (err) {
					return false;
				}

				return recordValue.lessThanOrEqualTo(ruleValue);

			}
			// Loose comparison; don't use 'localeCompare' because we only want to compare
			// numbers or well-formatted dates, which work with normal string comparison
			return (recordValue <= ruleValue);
		},
		ruleContains: function(recordValue, ruleValue) {

			if (Array.isArray(recordValue)) {

				// Normalize Value as Array
				if (!Array.isArray(ruleValue)) {
					ruleValue = [ruleValue];
				}

				// Loop Array of Values
				for (var index = 0; index < ruleValue.length; index++) {

					// Value Not Found in Record
					if (recordValue.indexOf(ruleValue[index]) === -1) {
						return false;
					}

				}

				return true;

			}
			else {
				return String(recordValue).indexOf(String(ruleValue)) !== -1;
			}


		},
		ruleDoesNotContain: function(recordValue, ruleValue) {
			return !this.ruleContains(recordValue, ruleValue);
		},
		ruleStartsWith: function(recordValue, ruleValue) {
			if (Array.isArray(recordValue)) {
				return false;
			}
			return String(recordValue).startsWith(String(ruleValue));
		},
		ruleEndsWith: function(recordValue, ruleValue) {
			if (Array.isArray(recordValue)) {
				return false;
			}
			return String(recordValue).endsWith(String(ruleValue));
		},
		ruleIn: function(recordValue, ruleValue) {
			if (!isArray(ruleValue)) {
				return false;
			}
			if (isArray(recordValue)) {
				for (var i = 0; i < recordValue.length; i++) {
					if (matchers.ruleIn(recordValue[i], ruleValue)) {
						return true;
					}
				}
				return false;
			} else {
				var iRecordValue = String(recordValue).toLowerCase();
				var iRuleValues = ruleValue.map(function(value) {
					return String(value).toLowerCase();
				});
				return (iRuleValues.indexOf(iRecordValue) !== -1);
			}
		},
		ruleNotIn: function(recordValue, ruleValue) {
			if (!isArray(ruleValue)) {
				return false;
			}
			return !matchers.ruleIn(recordValue, ruleValue);
		},
	};

	/**
	 * Determine whether the given record matches the given filter
	 *
	 * @param	{Object}	filter
	 * @param	{Object}	record
	 * @returns	{Boolean}
	 * @author	Paul W. Smith <paul@wizehive.com>
	 * @since	0.5.75
	 */
	function recordMatchesFilter(record, filter, options) {
		options = typeof options !== 'undefined' ? options : {};
		var currentOperator = Object.keys(filter)[0];
		if (filter[currentOperator].length === 0) {
			// Empty filter / no rules - considered a "match all"
			return true;
		}

		for (var i in filter[currentOperator]) {
			var match = recordMatchesRule(record, filter[currentOperator][i], options);
			if (currentOperator == 'or' && match) {
				return true;
			}
			if (currentOperator == 'and' && !match) {
				return false;
			}
		}
		// "and" - no misses by this point, return true
		// "or" - no matches by this point, return false
		return (currentOperator == 'and');
	}

	/**
	 * Determine whether the given record matches the given filter rule
	 *
	 * @param	{Object}	filter rule
	 * @param	{Object}	record
	 * @returns	{Boolean}
	 * @author	Paul W. Smith <paul@wizehive.com>
	 * @since	0.5.75
	 */
	function recordMatchesRule(record, rule, options) {
		options = typeof options !== 'undefined' ? options : {};
		var operators = ["and", "or"];

		if (operators.indexOf(Object.keys(rule)[0]) !== -1) {
			// Rule contains "and"/"or" key - nested filter
			return recordMatchesFilter(record, rule, options);
		}
		if (rule.filter !== undefined) {
			if (options.subfiltering) {
				var subRecord = record[rule.attribute];
				if (!recordMatchesFilter(subRecord, rule.filter, options)) {
					return false;
				}
				return true;
			} else {
				throw new Error("Subfilter matching is not supported");
			}
		}

		if (typeof rule.value === 'string' && rule.value.split('|').indexOf('logged-in-user') !== -1) {
			throw new Error ("Dynamic filter conditions are not supported");
		}

		// From here, we know we have a normal rule with "prefix", "attribute", and "value" properties.
		var recordValue = _getRecordValue(record, rule);
		var ruleValues = _getRuleValues(rule);

		// Run actual match logic based on rule prefix
		var matchFunction = ruleFunctionMap[rule.prefix];
		for (var i in ruleValues) {
			if (matchers[matchFunction](recordValue, ruleValues[i])) {
				return true;
			}
		}
		// All ruleValues failed to match
		return false;

	}

	/**
	 * Helper - parse rule values from filter rule
	 * If rule contains piped values, splits them into an array; otherwise
	 * yields an array-wrapped version of the single rule value for consistency
	 *
	 * @param	{Object}	filter rule
	 * @returns	{Array}		set of parsed rule values
	 * @author	Paul W. Smith <paul@wizehive.com>
	 * @since	0.5.75
	 */
	function _getRuleValues(rule) {
		if (typeof rule.value == 'string' && rule.value.indexOf('|') !== -1) {
			return rule.value.split('|');
		}
		if (rule.value === 'null' || rule.value === null) {
			return [''];
		}
		return [rule.value];
	}

	/**
	 * Helper - get the needed record value for comparison against this rule
	 *
	 * @param	{Object}	record
	 * @param	{Object}	filter rule
	 * @returns	{String|Boolean}
	 * @author	Paul W. Smith <paul@wizehive.com>
	 * @since	0.5.75
	 */
	function _getRecordValue(record, rule) {
		var attributePieces = rule.attribute.split(".");
		// Parse current record value of this rule's attribute, including dotted names (e.g. "folder.id")
		var recordValue = record;
		attributePieces.forEach(function(attributePiece) {
			recordValue = recordValue && recordValue[attributePiece];
		});

		// Parse subobject properties to use for check - e.g. field123.value for upload, field456.id for linked/member
		if (recordValue instanceof Object) {
			if (recordValue.value !== undefined) {
				recordValue = recordValue.value;
			} else if (recordValue.id !== undefined) {
				recordValue = recordValue.id;
			}
		} else if (recordValue === null || recordValue === undefined) {
			return '';
		}

		return recordValue;
	}

	return {
		recordMatchesFilter: recordMatchesFilter
	};

}());

module.exports = znFilterMatcher;
