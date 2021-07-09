//let child = {};
//axios.get("http://localhost:3000/chartData/60e75cb3b84c522c0cac732f")
axios.get("https://kitacheckin.herokuapp.com/chartData")
//const apiUrl = "http://127.0.0.1:3000/chartData/:id"
const apiUrl = "https://kitacheckin.herokuapp.com/chartData"
// .then(response => { 
// 	child = {...response.data.child};
//     console.log(child) })
// .catch(err => {
//     console.log( err)
// })


// const printChart = stockData => {
// 	const dailyData = stockData['Time Series (Daily)'];
// 	console.log(dailyData);
// 	// this is the data for the x axis
// 	const stockDates = Object.keys(dailyData);
// 	console.log(stockDates);
// 	// data for the y axis
// 	const stockPrices = stockDates.map(date => {
// 		return dailyData[date]['4. close'];
// 	});
// 	 console.log(stockPrices);

// 	//the chart
// 	const ctx = document.querySelector('#myChart').getContext('2d');

// 	new Chart(ctx, {
// 		type: 'line',
// 		data: {
// 			// x - axis
// 			labels: stockDates,
// 			datasets: [
// 				{
// 					label: 'Stock Chart',
// 					backgroundColor: 'rgb(255, 99, 132)',
// 					borderColor: 'rgb(255, 99, 132)',
// 					// y - axis
// 					data: stockPrices
// 				}
// 			]
// 		}
// 	})
// }
//console.log('hello')
axios.get(apiUrl)
	.then(response => {
		const ctx = document.querySelector('#myChart').getContext('2d');
		console.log('the resonpse has reached the chart: ',response)


		new Chart(ctx,  {
			type: 'bar',
			data: {
				labels: response.data.x,
				datasets: [{
					label: 'Attendance Chart',
					data: response.data.y,
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
					
					],
					borderWidth: 1
				}],
			},
			options: {
				scales: {
					yAxes: [{
						type: 'time',
						time: {
							displayFormats: {
								second: 'h:mm:ss a'
							}
						}
					}]
				}
			}
			
		})


	// new Chart(ctx,  {
	// 	type: 'bar',
	// 	data: {
	// 		// x - axis
	// 		labels: response.data.x,
	// 		datasets: [
	// 			{
	// 				label: 'Attendance Chart',
	// 				backgroundColor: 'rgb(255, 99, 132)',
	// 				borderColor: 'rgb(255, 99, 132)',
	// 				// y - axis
	// 				type: 'time',
	// 				time: {
	// 					unit: 'day'
	// 				},

	// 				data: response.data.y
	// 			}
	// 		]
	// 	}
	// })
	// 	 //console.log(response.data);
	// //	printChart(response.data)
	// })
	// .catch(err => {
	// 	console.log(err);
	 })