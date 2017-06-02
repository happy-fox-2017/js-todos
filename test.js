let arr = [{"task":"Dusta","completed":"[X]","created_date":"Fri Jun 02 2017 13:19:29 GMT+0700 (WIB)"},{"task":"Makan","completed":"[]","created_date":"Fri Jun 02 2017 12:45:40 GMT+0700 (WIB)"}]

// arr.sort(function(a, b){return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()});
arr[0]['tag'] = 'needs'
console.log(arr[0]);