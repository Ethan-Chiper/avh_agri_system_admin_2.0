module.exports = {
	reporter: 'node_modules/mochawesome',
	'reporter-option': [
		'overwrite=false',
		'reportTitle=Sptint Zero Unit Test Report',
		'reportFilename: [datetime]/[status]_[datetime]-sprint_zero-report',
		'charts=true',
		'timestamp=longDate'
	]
};
