
axios.get("http://localhost:3000/chartData/60e713ce1006681c07fc6d9a")
.then(response => { let {child} = response.data;
    console.log(child) })
.catch(err => {
    console.log( err)
})


const printChart = stockData => {
	const dailyData = stockData['Time Series (Daily)'];
	console.log(dailyData);
	// this is the data for the x axis
	const stockDates = Object.keys(dailyData);
	console.log(stockDates);
	// data for the y axis
	const stockPrices = stockDates.map(date => {
		return dailyData[date]['4. close'];
	});
	console.log(stockPrices);

	// the chart
	const ctx = document.querySelector('#myChart').getContext('2d');

	new Chart(ctx, {
		type: 'line',
		data: {
			// x - axis
			labels: stockDates,
			datasets: [
				{
					label: 'Stock Chart',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					// y - axis
					data: stockPrices
				}
			]
		}
	})
}