const WEATHER_KEY = process.env.WEATHER_API_KEY;
const KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;

const mailgun=require("mailgun-js")({apiKey: KEY, domain: DOMAIN})


// export async function sendEmail(to, subject, body){

//     const data = {
//       from: 'reminder@ketencek.com',
//       to,
//       subject,
//       text: body,
//     };
  
//     try {
//       await mailgun.messages().send(data);
//       console.log(`Email sent to ${to} with subject "${subject}"`);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   }
  
// sendEmail('idilaydindogan@gmail.com', 'Test emaili', 'idil sana deneme emaili gönderiyor :)');

export async function GET(req, res) {
	const city = "New York, NY";
	const countryCode = "US";

	const locationEndpoint = `http://dataservice.accuweather.com/locations/v1/cities/${countryCode}/search`;
	const locationRequest = await fetch(
		`${locationEndpoint}?q=${encodeURIComponent(city)}&apikey=${WEATHER_KEY}`
	);
	const locationData = await locationRequest.json();

	const locationKey = locationData[0].Key;
	const forecastEndpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}`;
	const forecastRequest = await fetch(
		`${forecastEndpoint}?apikey=${WEATHER_KEY}`
	);
	const forecastData = await forecastRequest.json();

	const data = {
		from: "Weather News <reminder@ketencek.com>",
		to: "idilaydindogan@gmail.com, idil_aydin@yahoo.com",
		subject: "Daily Weather Report",
		html: `<h1">${forecastData?.Headline?.Text}</h1>
    <p>${forecastData?.Headline?.Category}</p>
    <ul>
    <li>Temp Min: ${forecastData.DailyForecasts[0].Temperature.Minimum.Value}° ${forecastData.DailyForecasts[0].Temperature.Minimum.Unit}</li>
    <li>Temp Max: ${forecastData.DailyForecasts[0].Temperature.Maximum.Value}° ${forecastData.DailyForecasts[0].Temperature.Maximum.Unit}</li>
    </ul>
    <button>${forecastData?.Headline?.Link}</button>
    `,
	};

	mailgun.messages().send(data),
		(error, body) => {
			if (error) {
				console.log(error);
				res.status(500).send({ message: "Error in sending email" });
			}
			console.log(body?.message);
		};

	return new Response("Email was sent!", {
		status: 200,
	});
}